let ocorrencias = [];
let clientes = [];

const apiBaseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'https://crm-pb-web.onrender.com';

// Função para formatar data para dd/mm/aaaa
function formatarData(data) {
  if (!data) return '';
  const date = new Date(data);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
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
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiBaseUrl}/api/clientes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    clientes = await response.json();
    const clienteSelect = document.getElementById('clienteId');
    clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(cliente => {
      const option = document.createElement('option');
      option.value = cliente.id;
      option.textContent = `${cliente.codigo} - ${cliente.nome}`;
      clienteSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    showErrorToast('Erro ao carregar lista de clientes.');
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    ocorrencias = await response.json();
    console.log('Ocorrencias recebidas:', ocorrencias.length);

    ocorrenciasBody.innerHTML = '';
    ocorrencias.forEach(ocorrencia => {
      const cliente = clientes.find(c => c.id === ocorrencia.cliente_id) || { codigo: '-', nome: '-' };
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
  } catch (error) {
    console.error('Erro ao carregar ocorrências:', error);
    showErrorToast('Erro ao carregar ocorrências: ' + error.message);
  }
}

async function criarOcorrencia(event) {
  event.preventDefault();
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
    showErrorToast('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
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

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    showSuccessToast('Ocorrência criada com sucesso!');
    const modal = bootstrap.Modal.getInstance(document.getElementById('criarOcorrenciaModal'));
    modal.hide();
    form.reset();
    document.getElementById('dataRegistro').value = getDataAtual();
    await renderizarOcorrencias();
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

  if (!token || !['Operador', 'Gerente'].includes(permissao)) {
    showErrorToast('Acesso negado. Faça login como Operador ou Gerente.');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }

  const form = document.getElementById('criarOcorrenciaForm');
  const dataRegistroInput = document.getElementById('dataRegistro');
  if (form && dataRegistroInput) {
    dataRegistroInput.value = getDataAtual();
    form.addEventListener('submit', criarOcorrencia);
  } else {
    console.error('Formulário ou campo dataRegistro não encontrado');
  }

  popularClientes();
  renderizarOcorrencias();
});