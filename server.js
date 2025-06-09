const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_aqui'; // Defina no Render

app.use(cors({ origin: 'https://crm-pb-web.onrender.com' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function autenticar(permissoes) {
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
      if (permissoes && !permissoes.includes(result.rows[0].permissao)) {
        return res.status(403).json({ error: 'Permissão insuficiente' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Erro na autenticação:', error);
      res.status(401).json({ error: 'Token inválido' });
    }
  };
}

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  console.log('Tentativa de login:', { email, senha: '****' });
  if (!email || !senha) {
    console.log('Email ou senha não fornecidos');
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    console.log('Resultado da query:', { found: result.rows.length > 0, email });
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log('Senha válida:', senhaValida);
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

// Rota de Ocorrências (Gestor)
app.post('/api/ocorrencias', autenticar(['Gestor']), async (req, res) => {
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
    console.log('POST /api/ocorrencias:', { id: result.rows[0].id });
    res.json({ success: true, message: 'Ocorrência registrada com sucesso', id: result.rows[0].id });
  } catch (error) {
    console.error('Erro ao registrar ocorrência:', error);
    res.status(500).json({ error: 'Erro ao registrar ocorrência' });
  } finally {
    await client.end();
  }
});

app.get('/api/ocorrencias', autenticar(['Gerente']), async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM ocorrencias ORDER BY data_ocorrencia DESC');
    console.log('GET /api/crrmocs:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar ocorrências:', error);
    res.status(500).json({ error: 'Erro ao listar erros' });
  } finally {
    await client.end();
  }
});

// Nova Rota: Listar Ocorrências CRM
app.get('/api/ocorrencias-crm', autenticar(['Operador', 'Gerente']), async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const result = await client.query(`
      SELECT o.*, c.codigo, c.nome
      FROM ocorrencias_crm o
      LEFT JOIN clientes c ON o.cliente_id = c.id
      ORDER BY o.created_at DESC
    `);
    console.log('GET /api/ocorrencias-crm:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar ocorrências-crm:', error);
    res.status(500).json({ error: 'Erro ao listar ocorrências' });
  } finally {
    await client.end();
  }
});

// Nova Rota: Criar Ocorrência CRM
app.post('/api/ocorrencias-crm', autenticar(['Operador', 'Gerente']), async (req, res) => {
  const {
    data_registro,
    cliente_id,
    descricao_apontamento,
    responsavel_interno,
    acao_tomada,
    acompanhamento_erica_operacional,
    data_resolucao,
    feedback_cliente
  } = req.body;

  if (!data_registro || !cliente_id || !descricao_apontamento || !responsavel_interno || !acao_tomada || !acompanhamento_erica_operacional) {
    console.log('POST /api/ocorrencias-crm: Campos obrigatórios ausentes', req.body);
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query(`
      INSERT INTO ocorrencias_crm (
        data_registro, cliente_id, descricao_apontamento, responsavel_interno,
        acao_tomada, acompanhamento_erica_operacional, data_resolucao, feedback_cliente
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      data_registro,
      cliente_id,
      descricao_apontamento,
      responsavel_interno,
      acao_tomada,
      acompanhamento_erica_operacional,
      data_resolucao || null,
      feedback_cliente || null
    ]);
    console.log('POST /api/ocorrencias-crm:', { id: result.rows[0].id });
    res.status(201).json({ success: true, message: 'Ocorrência criada com sucesso', data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar ocorrência-crm:', error);
    res.status(500).json({ error: 'Erro ao criar ocorrência' });
  } finally {
    await client.end();
  }
});

// Rota de Clientes (ajustada com autenticação)
app.get('/api/clientes', autenticar(['Operador', 'Gerente', 'Gestor']), async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM clientes ORDER BY id');
    console.log('GET /api/clientes:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  } finally {
    await client.end();
  }
});

// Nova Rota: Criar Cliente
app.post('/api/clientes', autenticar(['Operador', 'Gerente', 'Gestor']), async (req, res) => {
  const {
    codigo, nome, razao_social, cpf_cnpj, regime_fiscal, situacao, tipo_pessoa,
    estado, municipio, status, possui_ie, ie, filial, empresa_matriz, grupo,
    segmento, data_entrada, data_saida, sistema, tipo_servico
  } = req.body;

  if (!codigo || !nome) {
    console.log('POST /api/clientes: Campos obrigatórios ausentes', req.body);
    return res.status(400).json({ error: 'Código e nome são obrigatórios' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query(
      `INSERT INTO clientes (
        codigo, nome, razao_social, cpf_cnpj, regime_fiscal, situacao, tipo_pessoa,
        estado, municipio, status, possui_ie, ie, filial, empresa_matriz, grupo,
        segmento, data_entrada, data_saida, sistema, tipo_servico
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        codigo, nome, razao_social || null, cpf_cnpj || null, regime_fiscal || null,
        situacao || null, tipo_pessoa || null, estado || null, municipio || null,
        status || null, possui_ie || null, ie || null, filial || null,
        empresa_matriz || null, grupo || null, segmento || null, data_entrada || null,
        data_saida || null, sistema || null, tipo_servico || null
      ]
    );
    console.log('POST /api/clientes:', { id: result.rows[0].id });
    res.status(201).json({ success: true, message: 'Cliente criado com sucesso', data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  } finally {
    await client.end();
  }
});

// Nova Rota: Atualizar Cliente
app.put('/api/clientes/:id', autenticar(['Operador', 'Gerente', 'Gestor']), async (req, res) => {
  const { id } = req.params;
  const {
    codigo, nome, razao_social, cpf_cnpj, regime_fiscal, situacao, tipo_pessoa,
    estado, municipio, status, possui_ie, ie, filial, empresa_matriz, grupo,
    segmento, data_entrada, data_saida, sistema, tipo_servico
  } = req.body;

  if (!codigo || !nome) {
    console.log('PUT /api/clientes/:id: Campos obrigatórios ausentes', req.body);
    return res.status(400).json({ error: 'Código e nome são obrigatórios' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query(
      `UPDATE clientes SET
        codigo = $1, nome = $2, razao_social = $3, cpf_cnpj = $4, regime_fiscal = $5,
        situacao = $6, tipo_pessoa = $7, estado = $8, municipio = $9, status = $10,
        possui_ie = $11, ie = $12, filial = $13, empresa_matriz = $14, grupo = $15,
        segmento = $16, data_entrada = $17, data_saida = $18, sistema = $19, tipo_servico = $20
      WHERE id = $21
      RETURNING *`,
      [
        codigo, nome, razao_social || null, cpf_cnpj || null, regime_fiscal || null,
        situacao || null, tipo_pessoa || null, estado || null, municipio || null,
        status || null, possui_ie || null, ie || null, filial || null,
        empresa_matriz || null, grupo || null, segmento || null, data_entrada || null,
        data_saida || null, sistema || null, tipo_servico || null, id
      ]
    );
    if (result.rows.length === 0) {
      console.log('PUT /api/clientes/:id: Cliente não encontrado', { id });
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    console.log('PUT /api/clientes/:id:', { id });
    res.json({ success: true, message: 'Cliente atualizado com sucesso', data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
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
          estado, municipio, status, possui_ie, ie, filial, empresa_matriz, grupo,
          segmento, data_entrada, data_saida, sistema, tipo_servico
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (codigo) DO UPDATE SET
          nome = EXCLUDED.nome, razao_social = EXCLUDED.razao_social, cpf_cnpj = EXCLUDED.cpf_cnpj,
          regime_fiscal = EXCLUDED.regime_fiscal, situacao = EXCLUDED.situacao,
          tipo_pessoa = EXCLUDED.tipo_pessoa, estado = EXCLUDED.estado, municipio = EXCLUDED.municipio,
          status = EXCLUDED.status, possui_ie = EXCLUDED.possui_ie, ie = EXCLUDED.ie,
          filial = EXCLUDED.filial, empresa_matriz = EXCLUDED.empresa_matriz, grupo = EXCLUDED.grupo,
          segmento = EXCLUDED.segmento, data_entrada = EXCLUDED.data_entrada, data_saida = EXCLUDED.data_saida,
          sistema = EXCLUDED.sistema, tipo_servico = EXCLUDED.tipo_servico`,
        [
          cliente.codigo, cliente.nome, cliente.razao_social, cliente.cpf_cnpj,
          cliente.regime_fiscal, cliente.situacao, cliente.tipo_pessoa, cliente.estado,
          cliente.municipio, cliente.status, cliente.possui_ie, cliente.ie, cliente.filial,
          cliente.empresa_matriz, cliente.grupo, cliente.segmento, cliente.data_entrada,
          cliente.data_saida, cliente.sistema, cliente.tipo_servico
        ]
      );
    }
    console.log('POST /api/clientes/import:', clientes.length);
    res.json({ success: true, message: ' clientes importados com sucesso' });
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
      console.log('DELETE /api/clientes/:id: Cliente não encontrado', { id });
      res.status(404).json({ success: false, error: 'Cliente não encontrado' });
    } else {
      console.log('DELETE /api/clientes/:id:', { id });
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