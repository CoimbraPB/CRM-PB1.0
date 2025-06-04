const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_aqui'; // Defina no Render

app.use(cors({ origin: 'https://crm-pb-web.onrender.com' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function autenticar(permissao) {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      await client.connect();
      const result = await client.query('SELECT permissao FROM usuarios WHERE id = $1', [decoded.userId]);
      await client.end();

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }
      if (permissao && result.rows[0].permissao !== permissao) {
        return res.status(403).json({ error: 'Permissão insuficiente' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
}

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: usuario.id, permissao: usuario.permissao }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, permissao: usuario.permissao });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao autenticar' });
  } finally {
    await client.end();
  }
});

app.post('/api/ocorrencias', autenticar('Gestor'), async (req, res) => {
  const {
    data_ocorrencia, setor, descricao, cliente_impactado, valor_desconto, tipo_desconto,
    colaborador_nome, colaborador_cargo, advertido, tipo_advertencia, advertencia_outra,
    cliente_comunicado, meio_comunicacao, comunicacao_outro, acoes_imediatas,
    acoes_corretivas, acoes_preventivas, responsavel_nome, responsavel_data
  } = req.body;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query(
      `INSERT INTO ocorrencias (
        data_ocorrencia, setor, descricao, cliente_impactado, valor_desconto, tipo_desconto,
        colaborador_nome, colaborador_cargo, advertido, tipo_advertencia, advertencia_outra,
        cliente_comunicado, meio_comunicacao, comunicacao_outro, acoes_imediatas,
        acoes_corretivas, acoes_preventivas, responsavel_nome, responsavel_data, criado_por
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING id`,
      [
        data_ocorrencia, setor, descricao, cliente_impactado, valor_desconto, tipo_desconto,
        colaborador_nome, colaborador_cargo, advertido, tipo_advertencia, advertencia_outra,
        cliente_comunicado, meio_comunicacao, comunicacao_outro, acoes_imediatas,
        acoes_corretivas, acoes_preventivas, responsavel_nome, responsavel_data, req.user.userId
      ]
    );
    res.json({ success: true, message: 'Ocorrência registrada com sucesso', id: result.rows[0].id });
  } catch (error) {
    console.error('Erro ao registrar ocorrência:', error);
    res.status(500).json({ error: 'Erro ao registrar ocorrência' });
  } finally {
    await client.end();
  }
});

app.get('/api/ocorrencias', autenticar('Gerente'), async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM ocorrencias ORDER BY data_ocorrencia DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar ocorrências:', error);
    res.status(500).json({ error: 'Erro ao listar ocorrências' });
  } finally {
    await client.end();
  }
});

// Rotas existentes para clientes
app.get('/api/clientes', async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM clientes ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  } finally {
    await client.end();
  }
});

app.post('/api/clientes/import', async (req, res) => {
  const clientes = req.body;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    for (const cliente of clientes) {
      await client.query(
        `INSERT INTO clientes (
          codigo, nome, razao_social, cpf_cnpj, regime_fiscal, situacao, tipo_pessoa,
          estado, municipio, status, possui_ie, ie, filial, empresa_matriz, grupo
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (codigo) DO UPDATE SET
          nome = EXCLUDED.nome, razao_social = EXCLUDED.razao_social, cpf_cnpj = EXCLUDED.cpf_cnpj,
          regime_fiscal = EXCLUDED.regime_fiscal, situacao = EXCLUDED.situacao,
          tipo_pessoa = EXCLUDED.tipo_pessoa, estado = EXCLUDED.estado, municipio = EXCLUDED.municipio,
          status = EXCLUDED.status, possui_ie = EXCLUDED.possui_ie, ie = EXCLUDED.ie,
          filial = EXCLUDED.filial, empresa_matriz = EXCLUDED.empresa_matriz, grupo = EXCLUDED.grupo`,
        [
          cliente.codigo, cliente.nome, cliente.razao_social, cliente.cpf_cnpj,
          cliente.regime_fiscal, cliente.situacao, cliente.tipo_pessoa, cliente.estado,
          cliente.municipio, cliente.status, cliente.possui_ie, cliente.ie, cliente.filial,
          cliente.empresa_matriz, cliente.grupo
        ]
      );
    }
    res.json({ success: true, message: 'Clientes importados com sucesso' });
  } catch (error) {
    console.error('Erro ao importar clientes:', error);
    res.status(500).json({ error: 'Erro ao importar clientes' });
  } finally {
    await client.end();
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const result = await client.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Cliente não encontrado' });
    } else {
      res.json({ success: true, message: 'Cliente excluído com sucesso' });
    }
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  } finally {
    await client.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});