let ocorrencias = [];
let clientesOcorrencias = [];

const apiBaseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'https://crm-pb-web.onrender.com';

// Função para formatar data para dd/mm/aaaa
function formatarData(data) {
  if (!data) return '';
  // Extrai ano, mês e dia da string YYYY-MM-DD
  const [ano, mes, dia] = data.split('-');
  // Cria data local sem ajuste de fuso horário
  const date = new Date(ano, mes - 1, dia);
  const diaFormatado = String(date.getDate()).padStart(2, '0');
  const mesFormatado = String(date.getMonth() + 1).padStart(2, '0');
  const anoFormatado = date.getFullYear();
  return `${diaFormatado}/${mesFormatado}/${anoFormatado}`;
}

// Função para obter data atual em formato YYYY-MM-DD
function getDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function showSuccessToast(message) {
  const toast = document.getElementById('successToast');
  const toastMessage = document.getElementById('successToastMessage');
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  } else {
    console.error('Toast elements not found:', { toast, toastMessage });
    alert(message);
  }
}

function showErrorToast(message) {
  const toast = document.getElementById('errorToast');
  const toastMessage = document.getElementById('errorToastMessage');
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  } else {
    console.error('Toast error elements not found:', { toast, toastMessage });
    alert(message);
  }
}

async function popularClientes() {
  console.log('Iniciando popularClientes');
  try {
    const token = localStorage.getItem('token');
    console.log('Token para GET /api/clientes:', token ? 'Presente' : 'Ausente');
    if (!token) {
      throw new Error('Token de autenticação ausente.');
    }
    const response = await fetch(`${apiBaseUrl}/api/clientes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Resposta GET /api/clientes:', response.status, response.statusText);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
    }
    clientesOcorrencias = await response.json();
    console.log('Clientes recebidos:', clientesOcorrencias.length, clientesOcorrencias);
    const clienteSelect = document.getElementById('clienteId');
    if (!clienteSelect) {
      console.error('Elemento clienteId não encontrado');
      showErrorToast('Erro: Elemento de seleção de clientes não encontrado.');
      return;
    }
    clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    clientesOcorrencias.forEach(cliente => {
      const option = document.createElement('option');
      option.value = cliente.id;
      option.textContent = `${cliente.codigo} - ${cliente.nome}`;
      clienteSelect.appendChild(option);
    });
    console.log('Dropdown de clientes populado com sucesso');
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    showErrorToast('Erro ao carregar lista de clientes: ' + error.message);
  }
}

async function renderizarOcorrencias() {
  console.log('Rendering ocorrencias');
  const ocorrenciasBody = document.getElementById('ocorrenciasBody');
  if (!ocorrenciasBody) {
    console.error('Elemento ocorrenciasBody não encontrado');
    showErrorToast('Erro: Interface não carregada corretamente.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Present' : 'Missing');
    if (!token) {
      throw new Error('Token de autenticação ausente.');
    }

    const response = await fetch(`${apiBaseUrl}/api/ocorrencias-crm`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Ocorrencias response:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('permissao');
        showErrorToast('Sessão expirada. Faça login novamente.');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
      }
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
    }

    ocorrencias = await response.json();
    console.log('Ocorrencias recebidas:', ocorrencias.length, ocorrencias);

    ocorrenciasBody.innerHTML = '';
    ocorrencias.forEach(ocorrencia => {
      const cliente = clientesOcorrencias.find(c => c.id === ocorrencia.cliente_id) || { codigo: '-', nome: '-' };
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${ocorrencia.id || ''}</td>
        <td>${formatarData(ocorrencia.data_registro)}</td>
        <td>${cliente.codigo} - ${cliente.nome}</td>
        <td>${ocorrencia.descricao_apontamento || ''}</td>
        <td>${ocorrencia.responsavel_interno || ''}</td>
        <td>${ocorrencia.acao_tomada || ''}</td>
        <td>${ocorrencia.acompanhamento_erica_operacional || ''}</td>
        <td>${formatarData(ocorrencia.data_resolucao)}</td>
        <td>${ocorrencia.feedback_cliente || ''}</td>
      `;
      ocorrenciasBody.appendChild(tr);
    });
    console.log('Tabela de ocorrências renderizada com sucesso');
  } catch (error) {
    console.error('Erro ao carregar ocorrências:', error);
    showErrorToast('Erro ao carregar ocorrências: ' + error.message);
  }
}

async function criarOcorrencia(event) {
  event.preventDefault();
  console.log('Iniciando criação de ocorrência');
  const form = document.getElementById('criarOcorrenciaForm');
  const dataRegistro = document.getElementById('dataRegistro').value;
  const clienteId = document.getElementById('clienteId').value;
  const descricaoApontamento = document.getElementById('descricaoApontamento').value.trim();
  const responsavelInterno = document.getElementById('responsavelInterno').value.trim();
  const acaoTomada = document.getElementById('acaoTomada').value.trim();
  const acompanhamentoEricaOperacional = document.getElementById('acompanhamentoEricaOperacional').value.trim();
  const dataResolucao = document.getElementById('dataResolucao').value;
  const feedbackCliente = document.getElementById('feedbackCliente').value.trim();

  if (!dataRegistro || !clienteId || !descricaoApontamento || !responsavelInterno || !acaoTomada || !acompanhamentoEricaOperacional) {
    console.log('Campos obrigatórios ausentes:', { dataRegistro, clienteId, descricaoApontamento, responsavelInterno, acaoTomada, acompanhamentoEricaOperacional });
    showErrorToast('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    console.log('Token para POST /api/ocorrencias-crm:', token ? 'Presente' : 'Ausente');
    const response = await fetch(`${apiBaseUrl}/api/ocorrencias-crm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data_registro: dataRegistro,
        cliente_id: parseInt(clienteId),
        descricao_apontamento: descricaoApontamento,
        responsavel_interno: responsavelInterno,
        acao_tomada: acaoTomada,
        acompanhamento_erica_operacional: acompanhamentoEricaOperacional,
        data_resolucao: dataResolucao || null,
        feedback_cliente: feedbackCliente || null
      })
    });

    console.log('Resposta POST /api/ocorrencias-crm:', response.status, response.statusText);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
    }

    showSuccessToast('Ocorrência criada com sucesso!');
    const modal = bootstrap.Modal.getInstance(document.getElementById('criarOcorrenciaModal'));
    modal.hide();
    form.reset();
    document.getElementById('dataRegistro').value = getDataAtual();
    await renderizarOcorrencias();
    console.log('Ocorrência criada e tabela atualizada');
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    showErrorToast('Erro ao criar ocorrência: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando ocorrencia.js');
  console.log('API_BASE_URL:', apiBaseUrl);
  const token = localStorage.getItem('token');
  const permissao = localStorage.getItem('permissao');
  console.log('Token:', token ? 'Presente' : 'Ausente', 'Permissao:', permissao);

  if (!token || !['Operador', 'Gerente'].includes(permissao)) {
    console.log('Acesso negado:', { token: !!token, permissao });
    showErrorToast('Acesso negado. Faça login como Operador ou Gerente.');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }

  const form = document.getElementById('criarOcorrenciaForm');
  const dataRegistroInput = document.getElementById('dataRegistro');
  if (form && dataRegistroInput) {
    dataRegistroInput.value = getDataAtual();
    form.addEventListener('submit', criarOcorrencia);
    console.log('Formulário inicializado');
  } else {
    console.error('Formulário ou campo dataRegistro não encontrado:', { form, dataRegistroInput });
  }

  popularClientes();
  renderizarOcorrencias();
});