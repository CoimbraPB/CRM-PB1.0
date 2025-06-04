const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';
const OCORRENCIAS_POR_PAGINA = 10;
let paginaAtual = 1;
let ocorrencias = [];

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

function formatarData(data) {
  if (!data) return 'N/A';
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR');
}

function carregarOcorrencias() {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    const permissao = localStorage.getItem('permissao');
    if (!token || permissao !== 'Gerente') {
      showErrorToast('Acesso negado. Faça login como Gerente.');
      setTimeout(() => window.location.href = 'login.html', 1000);
      reject(new Error('Acesso negado'));
      return;
    }

    fetch(`${API_BASE_URL}/api/ocorrencias`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log('Dados recebidos:', data);
        ocorrencias = data;
        atualizarTabela();
        resolve();
      })
      .catch(error => {
        console.error('Erro ao carregar ocorrências:', error);
        showErrorToast('Erro ao carregar ocorrências.');
        reject(error);
      });
  });
}

function atualizarTabela() {
  const filtroInput = document.getElementById('filtroInput').value.toLowerCase();
  const filtroSetor = document.getElementById('filtroSetor').value;
  const tbody = document.getElementById('ocorrenciasBody');
  tbody.innerHTML = '';

  const ocorrenciasFiltradas = ocorrencias.filter(ocorrencia => {
    const matchesFiltro = ocorrencia.cliente_impactado.toLowerCase().includes(filtroInput) ||
      ocorrencia.setor.toLowerCase().includes(filtroInput) ||
      ocorrencia.colaborador_nome.toLowerCase().includes(filtroInput);
    const matchesSetor = !filtroSetor || ocorrencia.setor === filtroSetor;
    return matchesFiltro && matchesSetor;
  });

  const totalPaginas = Math.ceil(ocorrenciasFiltradas.length / OCORRENCIAS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * OCORRENCIAS_POR_PAGINA;
  const fim = inicio + OCORRENCIAS_POR_PAGINA;
  const ocorrenciasPaginadas = ocorrenciasFiltradas.slice(inicio, fim);

  ocorrenciasPaginadas.forEach(ocorrencia => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ocorrencia.id}</td>
      <td>${formatarData(ocorrencia.data_ocorrencia)}</td>
      <td>${ocorrencia.setor}</td>
      <td>${ocorrencia.cliente_impactado}</td>
      <td>${ocorrencia.colaborador_nome}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="mostrarDetalhes(${ocorrencia.id})">
          <i class="bi bi-eye"></i> Visualizar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('paginacaoInfo').textContent = `Página ${paginaAtual} de ${totalPaginas} (${ocorrenciasFiltradas.length} ocorrências)`;
}

function mostrarDetalhes(id) {
  const ocorrencia = ocorrencias.find(o => o.id === id);
  if (!ocorrencia) {
    showErrorToast('Ocorrência não encontrada.');
    return;
  }

  const content = `
    <p><strong>ID:</strong> ${ocorrencia.id}</p>
    <p><strong>Data:</strong> ${formatarData(ocorrencia.data_ocorrencia)}</p>
    <p><strong>Setor:</strong> ${ocorrencia.setor}</p>
    <p><strong>Cliente Impactado:</strong> ${ocorrencia.cliente_impactado}</p>
    <p><strong>Descrição:</strong> ${ocorrencia.descricao}</p>
    <p><strong>Valor do Desconto:</strong> ${ocorrencia.valor_desconto || 'N/A'}</p>
    <p><strong>Tipo de Desconto:</strong> ${ocorrencia.tipo_desconto || 'N/A'}</p>
    <p><strong>Colaborador:</strong> ${ocorrencia.colaborador_nome} (${ocorrencia.colaborador_cargo || 'N/A'})</p>
    <p><strong>Advertido:</strong> ${ocorrencia.advertido}</p>
    <p><strong>Tipo de Advertência:</strong> ${ocorrencia.tipo_advertencia || 'N/A'}</p>
    <p><strong>Advertência Outra:</strong> ${ocorrencia.advertencia_outra || 'N/A'}</p>
    <p><strong>Cliente Comunicado:</strong> ${ocorrencia.cliente_comunicado}</p>
    <p><strong>Meio de Comunicação:</strong> ${ocorrencia.meio_comunicacao || 'N/A'}</p>
    <p><strong>Comunicação Outro:</strong> ${ocorrencia.comunicacao_outro || 'N/A'}</p>
    <p><strong>Ações Imediatas:</strong> ${ocorrencia.acoes_imediatas || 'N/A'}</p>
    <p><strong>Ações Corretivas:</strong> ${ocorrencia.acoes_corretivas || 'N/A'}</p>
    <p><strong>Ações Preventivas:</strong> ${ocorrencia.acoes_preventivas || 'N/A'}</p>
    <p><strong>Responsável:</strong> ${ocorrencia.responsavel_nome} (${formatarData(ocorrencia.responsavel_data)})</p>
    <p><strong>Criado Por:</strong> ${ocorrencia.criado_por}</p>
  `;
  document.getElementById('detalhesOcorrenciaContent').innerHTML = content;

  const modal = new bootstrap.Modal(document.getElementById('detalhesOcorrenciaModal'));
  modal.show();
}

async function gerarRelatorio() {
  const token = localStorage.getItem('token');
  const permissao = localStorage.getItem('permissao');
  if (!token || permissao !== 'Gerente') {
    showErrorToast('Acesso negado. Faça login como Gerente.');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }

  try {
    await carregarOcorrencias();
  } catch (error) {
    showErrorToast('Erro ao carregar dados para o relatório.');
    return;
  }

  const relatorioSetor = document.getElementById('relatorioSetor').value;
  console.log('Setor selecionado:', relatorioSetor);
  const ocorrenciasFiltradas = relatorioSetor
    ? ocorrencias.filter(o => o.setor === relatorioSetor)
    : ocorrencias;

  console.log('Ocorrências filtradas:', ocorrenciasFiltradas);
  if (ocorrenciasFiltradas.length === 0) {
    showErrorToast(`Nenhuma ocorrência encontrada para o setor ${relatorioSetor || 'selecionado'}.`);
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Título
  doc.setFontSize(16);
  doc.text(`Relatório de Ocorrências${relatorioSetor ? ' - Setor: ' + relatorioSetor : ''}`, 14, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

  // Tabela
  const headers = [['ID', 'Data', 'Setor', 'Cliente', 'Descrição']];
  const data = ocorrenciasFiltradas.map(o => [
    o.id,
    formatarData(o.data_ocorrencia),
    o.setor,
    o.cliente_impactado,
    o.descricao
  ]);

  doc.autoTable({
    head: headers,
    body: data,
    startY: 40,
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [200, 200, 200] },
    columnStyles: {
      0: { cellWidth: 20 }, // ID
      1: { cellWidth: 30 }, // Data
      2: { cellWidth: 40 }, // Setor
      3: { cellWidth: 50 }, // Cliente
      4: { cellWidth: 100 } // Descrição
    }
  });

  try {
    doc.save(`relatorio_ocorrencias${relatorioSetor ? '_' + relatorioSetor.toLowerCase() : ''}_${new Date().toISOString().slice(0,10)}.pdf`);
    console.log('PDF gerado com sucesso');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    showErrorToast('Erro ao gerar relatório.');
  }
}

function irParaPrimeiraPagina() {
  paginaAtual = 1;
  atualizarTabela();
}

function irParaPaginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    atualizarTabela();
  }
}

function irParaProximaPagina() {
  const filtroInput = document.getElementById('filtroInput').value.toLowerCase();
  const filtroSetor = document.getElementById('filtroSetor').value;
  const ocorrenciasFiltradas = ocorrencias.filter(ocorrencia => {
    const matchesFiltro = ocorrencia.cliente_impactado.toLowerCase().includes(filtroInput) ||
      ocorrencia.setor.toLowerCase().includes(filtroInput) ||
      ocorrencia.colaborador_nome.toLowerCase().includes(filtroInput);
    const matchesSetor = !filtroSetor || ocorrencia.setor === filtroSetor;
    return matchesFiltro && matchesSetor;
  });
  const totalPaginas = Math.ceil(ocorrenciasFiltradas.length / OCORRENCIAS_POR_PAGINA);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    atualizarTabela();
  }
}

function irParaUltimaPagina() {
  const filtroInput = document.getElementById('filtroInput').value.toLowerCase();
  const filtroSetor = document.getElementById('filtroSetor').value;
  const ocorrenciasFiltradas = fiche.filter(ocorrencia => {
    const matchesFiltro = ocorrencia.cliente_impactado.toLowerCase().includes(filtroInput) ||
      ocorrencia.setor.toLowerCase().includes(filtroInput) ||
      ocorrencia.colaborador_nome.toLowerCase().includes(filtroInput);
    const matchesSetor = !filtroSetor || ocorrencia.setor === filtroSetor;
    return matchesFiltro && matchesSetor;
  });
  paginaAtual = Math.ceil(ocorrenciasFiltradas.length / OCORRENCIAS_POR_PAGINA);
  atualizarTabela();
}

document.addEventListener('DOMContentLoaded', () => {
  carregarOcorrencias();
  document.getElementById('filtroInput').addEventListener('input', atualizarTabela);
  document.getElementById('filtroSetor').addEventListener('change', atualizarTabela);
});