const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';
let ocorrencias = [];
let paginaAtual = 1;
const ocorrenciasPorPagina = 10;

function showErrorToast(message) {
  const toast = document.getElementById('errorToast');
  document.getElementById('errorToastMessage').textContent = message;
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('permissao');
  window.location.href = 'login.html';
}

async function renderizarOcorrencias() {
  const tbody = document.getElementById('ocorrenciasBody');
  const paginacaoInfo = document.getElementById('paginacaoInfo');
  if (!tbody || !paginacaoInfo) {
    showErrorToast('Erro: Interface não carregada.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/ocorrencias`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    ocorrencias = await response.json();
    tbody.innerHTML = '';

    const filtroInput = document.getElementById('filtroInput').value.toLowerCase();
    const filtroSetor = document.getElementById('filtroSetor').value;
    const ocorrenciasFiltradas = ocorrencias.filter(ocorrencia => 
      (ocorrencia.cliente_impactado || '').toLowerCase().includes(filtroInput) ||
      (ocorrencia.setor || '').toLowerCase().includes(filtroInput) &&
      (!filtroSetor || ocorrencia.setor === filtroSetor)
    );

    const totalPaginas = Math.ceil(ocorrenciasFiltradas.length / ocorrenciasPorPagina);
    paginaAtual = Math.min(paginaAtual, totalPaginas || 1);

    const inicio = (paginaAtual - 1) * ocorrenciasPorPagina;
    const fim = inicio + ocorrenciasPorPagina;
    const ocorrenciasPagina = ocorrenciasFiltradas.slice(inicio, fim);

    ocorrenciasPagina.forEach(ocorrencia => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${ocorrencia.id}</td>
        <td>${new Date(ocorrencia.data_ocorrencia).toLocaleDateString('pt-BR')}</td>
        <td>${ocorrencia.setor}</td>
        <td>${ocorrencia.cliente_impactado || ''}</td>
        <td>${ocorrencia.descricao}</td>
      `;
      tbody.appendChild(tr);
    });

    paginacaoInfo.textContent = `Página ${paginaAtual} de ${totalPaginas} (${ocorrenciasFiltradas.length} ocorrências)`;
  } catch (error) {
    showErrorToast('Erro ao carregar ocorrências: ' + error.message);
  }
}

function filtrarOcorrencias() {
  paginaAtual = 1;
  renderizarOcorrencias();
}

function irParaPrimeiraPagina() {
  paginaAtual = 1;
  renderizarOcorrencias();
}

function irParaPaginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarOcorrencias();
  }
}

function irParaProximaPagina() {
  const totalPaginas = Math.ceil(ocorrencias.length / ocorrenciasPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    renderizarOcorrencias();
  }
}

function irParaUltimaPagina() {
  const totalPaginas = Math.ceil(ocorrencias.length / ocorrenciasPorPagina);
  paginaAtual = totalPaginas || 1;
  renderizarOcorrencias();
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const permissao = localStorage.getItem('permissao');
  if (!token || permissao !== 'Gerente') {
    showErrorToast('Acesso negado. Faça login como Gerente.');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }

  document.getElementById('filtroInput').addEventListener('input', filtrarOcorrencias);
  document.getElementById('filtroSetor').addEventListener('change', filtrarOcorrencias);
  renderizarOcorrencias();
});