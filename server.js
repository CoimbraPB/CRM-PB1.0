const { Client } = require('pg');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Função para criar a tabela de clientes
async function criarTabelaClientes(client) {
  const query = `
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      codigo VARCHAR(50) NOT NULL UNIQUE,
      nome VARCHAR(100) NOT NULL,
      razao_social VARCHAR(100),
      cpf_cnpj VARCHAR(20) NOT NULL,
      regime_fiscal VARCHAR(50),
      situacao VARCHAR(20),
      tipo_pessoa VARCHAR(20),
      estado VARCHAR(50),
      municipio VARCHAR(100),
      status VARCHAR(20),
      possui_ie VARCHAR(20),
      ie VARCHAR(50),
      filial VARCHAR(50),
      empresa_matriz VARCHAR(50),
      grupo VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await client.query(query);
}

// Rota para importar clientes
app.post('/api/clientes/import', async (req, res) => {
  const clientes = req.body;
  if (!Array.isArray(clientes) || clientes.length === 0) {
    return res.status(400).json({ success: false, error: 'O arquivo deve conter um array de clientes não vazio' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://clientes_v6h2_user:Ae7UBJJzSN9bivs5Q0fvc7SYYrLP3liz@dpg-d0v0fjndiees73cc6d0g-a.oregon-postgres.render.com/clientes_v6h2',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await criarTabelaClientes(client);
    for (const cliente of clientes) {
      const query = `
        INSERT INTO clientes (
          codigo, nome, razao_social, cpf_cnpj, regime_fiscal, situacao, 
          tipo_pessoa, estado, municipio, status, possui_ie, ie, filial, 
          empresa_matriz, grupo
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (codigo) DO UPDATE 
        SET nome = EXCLUDED.nome,
            razao_social = EXCLUDED.razao_social,
            cpf_cnpj = EXCLUDED.cpf_cnpj,
            regime_fiscal = EXCLUDED.regime_fiscal,
            situacao = EXCLUDED.situacao,
            tipo_pessoa = EXCLUDED.tipo_pessoa,
            estado = EXCLUDED.estado,
            municipio = EXCLUDED.municipio,
            status = EXCLUDED.status,
            possui_ie = EXCLUDED.possui_ie,
            ie = EXCLUDED.ie,
            filial = EXCLUDED.filial,
            empresa_matriz = EXCLUDED.empresa_matriz,
            grupo = EXCLUDED.grupo,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      const values = [
        cliente.codigo,
        cliente.nome,
        cliente.cpf_cnpj,
        cliente.razao_social || null,
        cliente.regime_fiscal || 'Simples Nacional',
        cliente.situacao || 'Ativo',
        cliente.tipo_pessoa || 'Física',
        cliente.estado || null,
        cliente.municipio || null,
        cliente.status || 'Ativo',
        cliente.possui_ie || 'Não',
        cliente.ie || null,
        cliente.filial || null,
        cliente.empresa_matriz || null,
        cliente.grupo || null
      ];
      await client.query(query, values);
    }
    res.json({ success: true, message: `Importados ${clientes.length} clientes com sucesso`});
  } catch (error) {
    res.status(500).json({ success: false, error: `Erro ao importar clientes: ${error.message}` });
  } finally {
    await client.end();
  }
});

// Rota para obter todos os clientes
app.get('/api/clientes', async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://clientes_v6h2_user:Ae7UBJJzSN9bivs5Q0fvc7SYYrLP3liz@dpg-d0v0fjndiees73cc6d0g-a.oregon-postgres.render.com/clientes_v6h2',
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM clientes ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar clientes: ${error.message}` });
  } finally {
    await client.end();
  }
});

// Rota para adicionar um cliente
app.post('/api/clientes', async (req, res) => {
  const cliente = req.body;
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://clientes_v6h2_user:Ae7UBJJzSN9bivs5Q0fvc7SYYrLP3liz@dpg-d0v0fjndiees73cc6d0g-a.oregon-postgres.render.com/clientes_v6h2',
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const query = `
      INSERT INTO clientes (
        codigo, nome, razao_social, cpf_cnpj, regime_fiscal, situacao, 
        tipo_pessoa, estado, municipio, status, possui_ie, ie, filial, 
        empresa_matriz, grupo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;
    const values = [
      cliente.codigo, cliente.nome, cliente.razao_social, cliente.cpf_cnpj,
      cliente.regime_fiscal, cliente.situacao, cliente.tipo_pessoa, cliente.estado,
      cliente.municipio, cliente.status, cliente.possui_ie, cliente.ie,
      cliente.filial, cliente.empresa_matriz, cliente.grupo
    ];
    const result = await client.query(query, values);
    res.json({ success: true, cliente: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: `Erro ao adicionar cliente: ${error.message}` });
  } finally {
    await client.end();
  }
});

// Rota para atualizar um cliente
app.put('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const cliente = req.body;
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://clientes_v6h2_user:Ae7UBJJzSN9bivs5Q0fvc7SYYrLP3liz@dpg-d0v0fjndiees73cc6d0g-a.oregon-postgres.render.com/clientes_v6h2',
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const query = `
      UPDATE clientes 
      SET codigo = $1, nome = $2, razao_social = $3, cpf_cnpj = $4, 
          regime_fiscal = $5, situacao = $6, tipo_pessoa = $7, estado = $8, 
          municipio = $9, status = $10, possui_ie = $11, ie = $12, 
          filial = $13, empresa_matriz = $14, grupo = $15, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING *;
    `;
    const values = [
      cliente.codigo, cliente.nome, cliente.razao_social, cliente.cpf_cnpj,
      cliente.regime_fiscal, cliente.situacao, cliente.tipo_pessoa, cliente.estado,
      cliente.municipio, cliente.status, cliente.possui_ie, cliente.ie,
      cliente.filial, cliente.empresa_matriz, cliente.grupo, id
    ];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Cliente não encontrado' });
    } else {
      res.json({ success: true, cliente: result.rows[0] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: `Erro ao atualizar cliente: ${error.message}` });
  } finally {
    await client.end();
  }
});

// Rota para excluir um cliente
app.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://clientes_v6h2_user:Ae7UBJJzSN9bivs5Q0fvc7SYYrLP3liz@dpg-d0v0fjndiees73cc6d0g-a.oregon-postgres.render.com/clientes_v6h2',
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
    res.status(500).json({ success: false, error: `Erro ao excluir cliente: ${error.message}` });
  } finally {
    await client.end();
  }
});

// Servir arquivos HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ocorrencias', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ocorrencias.html'));
});

// Iniciar o servidor
app.listen(port, async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://clientes_v6h2_user:Ae7UBJJzSN9bivs5Q0fvc7SYYrLP3liz@dpg-d0v0fjndiees73cc6d0g-a.oregon-postgres.render.com/clientes_v6h2',
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    await criarTabelaClientes(client);
  } catch (error) {
    console.error('Erro ao inicializar o banco:', error.message);
  } finally {
    await client.end();
  }
  console.log(`Servidor rodando em http://localhost:${port}`);
});