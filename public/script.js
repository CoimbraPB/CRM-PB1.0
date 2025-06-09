let clientes = [];
let paginaAtual = 1;
const clientesPorPagina = 10;

function renderNavbar() {
  console.log('Rendering navbar');
  const permissao = localStorage.getItem('permissao');
  const navbarLinks = document.getElementById('navbarLinks');
  if (!navbarLinks) {
    console.error('Elemento navbarLinks não encontrado');
    return;
  }
  console.log('Permissao:', permissao);

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  let linksHtml = '';

  if (!permissao) {
    linksHtml = `<a class="nav-link${currentPage === 'login.html' ? ' active' : ''}" href="login.html">Login</a>`;
  } else {
    linksHtml += `
      <a class="nav-link${currentPage === 'index.html' ? ' active' : ''}" href="index.html">Clientes</a>
    `;

    if (['Gerente', 'Gestor'].includes(permissao)) {
      linksHtml += `
        <a class="nav-link${currentPage === 'ocorrencias-gestor.html' ? ' active' : ''}" href="ocorrencias-gestor.html">Ocorrências Gestor</a>
      `;
    }

    if (['Operador', 'Gerente'].includes(permissao)) {
      linksHtml += `
        <a class="nav-link${currentPage === 'ocorrencia.html' ? ' active' : ''}" href="ocorrencia.html">Ocorrências</a>
      `;
    }

    if (permissao === 'Gerente') {
      linksHtml += `
        <a class="nav-link${currentPage === 'historico-ocorrencias.html' ? ' active' : ''}" href="historico-ocorrencias.html">Histórico de Ocorrências</a>
      `;
    }

    linksHtml += `
      <button class="btn btn-outline-danger btn-sm" onclick="logout()">Sair</button>
    `;
  }

  navbarLinks.innerHTML = linksHtml;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('permissao');
  window.location.href = 'login.html';
}

async function renderizarClientes() {
  console.log('Rendering clients');
  const clientesBody = document.getElementById('clientesBody');
  const paginacaoInfo = document.getElementById('paginacaoInfo');
  if (!clientesBody || !paginacaoInfo) {
    console.error('Elementos DOM não encontrados:', { clientesBody, paginacaoInfo });
    showErrorToast('Erro: Interface não carregada corretamente.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Present' : 'Missing');
    const response = await fetch(`${API_BASE_URL}/api/clientes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Clientes response:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    clientes = await response.json();
    console.log('Clientes recebidos:', clientes);
    clientesBody.innerHTML = '';
    const filtroInput = document.getElementById('filtroInput');
    const filtro = filtroInput ? filtroInput.value.toLowerCase() : '';
    const clientesFiltrados = clientes.filter(cliente => 
      (cliente.codigo || '').toLowerCase().includes(filtro) ||
      (cliente.nome || '').toLowerCase().includes(filtro) ||
      (cliente.razao_social || '').toLowerCase().includes(filtro) ||
      (cliente.cpf_cnpj || '').toLowerCase().includes(filtro) ||
      (cliente.situacao || '').toLowerCase().includes(filtro) ||
      (cliente.municipio || '').toLowerCase().includes(filtro) ||
      (cliente.status || '').toLowerCase().includes(filtro) ||
      (cliente.grupo || '').toLowerCase().includes(filtro) ||
      (cliente.segmento || '').toLowerCase().includes(filtro) ||
      (cliente.sistema || '').toLowerCase().includes(filtro) ||
      (Array.isArray(cliente.tipo_servico) ? cliente.tipo_servico.join(', ') : '').toLowerCase().includes(filtro)
    );

    const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
    paginaAtual = Math.min(paginaAtual, totalPaginas || 1);

    const inicio = (paginaAtual - 1) * clientesPorPagina;
    const fim = inicio + clientesPorPagina;
    const clientesPagina = clientesFiltrados.slice(inicio, fim);

    clientesPagina.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cliente.codigo || ''}</td>
        <td>${cliente.nome || ''}</td>
        <td>${cliente.razao_social || ''}</td>
        <td>${cliente.cpf_cnpj || ''}</td>
        <td>${cliente.regime_fiscal || ''}</td>
        <td>${cliente.situacao || ''}</td>
        <td>${cliente.tipo_pessoa || ''}</td>
        <td>${cliente.estado || ''}</td>
        <td>${cliente.municipio || ''}</td>
        <td>${cliente.status || ''}</td>
        <td>${cliente.possui_ie || ''}</td>
        <td>${cliente.ie || ''}</td>
        <td>${cliente.filial || ''}</td>
        <td>${cliente.empresa_matriz || ''}</td>
        <td>${cliente.grupo || ''}</td>
        <td>${cliente.segmento || ''}</td>
        <td>${cliente.data_entrada || ''}</td>
        <td>${cliente.data_saida || ''}</td>
        <td>${cliente.sistema || ''}</td>
        <td>${Array.isArray(cliente.tipo_servico) ? cliente.tipo_servico.join(', ') : ''}</td>
        <td>
          <button class="btn btn-primary btn-sm me-1" onclick="editarCliente(${cliente.id})" title="Editar">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="excluirCliente(${cliente.id})" title="Excluir">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      `;
      clientesBody.appendChild(tr);
    });

    paginacaoInfo.textContent = `Página ${paginaAtual} de ${totalPaginas} (${clientesFiltrados.length} clientes)`;
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    showErrorToast('Erro ao carregar clientes: ' + error.message);
  }
}

function importarClientes(files) {
  if (files.length === 0) return;
  
  const file = files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (!Array.isArray(importedData)) {
        throw new Error('O arquivo não contém um array de clientes válido.');
      }
      
      const primeiroCliente = importedData[0];
      if (!primeiroCliente || !primeiroCliente.codigo || !primeiroCliente.nome || !primeiroCliente.cpf_cnpj) {
        throw new Error('O arquivo não possui o formato esperado de clientes.');
      }
      
      if (confirm(`Deseja importar ${importedData.length} clientes? Isso substituirá ou atualizará clientes existentes com base no código.`)) {
        fetch(`${API_BASE_URL}/api/clientes/import`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(importedData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          return response.json();
        })
        .then(result => {
          if (result.success) {
            showSuccessToast(result.message || 'Clientes importados com sucesso!');
            renderizarClientes();
          } else {
            showErrorToast(result.error || 'Erro ao importar clientes.');
          }
        })
        .catch(error => {
          showErrorToast('Erro ao importar clientes: ' + error.message);
        });
      }
    } catch (error) {
      showErrorToast('Erro ao importar arquivo: ' + error.message);
    }
  };
  
  reader.onerror = function() {
    showErrorToast('Erro ao ler o arquivo');
  };
  
  reader.readAsText(file);
}

function abrirModal() {
  const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
  document.getElementById('clienteModalLabel').textContent = 'Adicionar Cliente';
  document.getElementById('clienteForm').reset();
  document.getElementById('clienteIndex').value = '';
  // Limpar checkboxes de tipo_servico
  document.querySelectorAll('#tipo_servico input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  modal.show();
}

function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) {
    showErrorToast('Cliente não encontrado.');
    return;
  }

  const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
  document.getElementById('clienteModalLabel').textContent = 'Editar Cliente';
  document.getElementById('codigo').value = cliente.codigo || '';
  document.getElementById('nome').value = cliente.nome || '';
  document.getElementById('razao_social').value = cliente.razao_social || '';
  document.getElementById('cpf_cnpj').value = cliente.cpf_cnpj || '';
  document.getElementById('regime_fiscal').value = cliente.regime_fiscal || 'Simples Nacional';
  document.getElementById('situacao').value = cliente.situacao || 'Ativo';
  document.getElementById('tipo_pessoa').value = cliente.tipo_pessoa || 'Física';
  document.getElementById('estado').value = cliente.estado || 'SP';
  document.getElementById('municipio').value = cliente.municipio || '';
  document.getElementById('status').value = cliente.status || 'Ativo';
  document.getElementById('possui_ie').value = cliente.possui_ie || 'Não';
  document.getElementById('ie').value = cliente.ie || '';
  document.getElementById('filial').value = cliente.filial || '';
  document.getElementById('empresa_matriz').value = cliente.empresa_matriz || '';
  document.getElementById('grupo').value = cliente.grupo || '';
  document.getElementById('segmento').value = cliente.segmento || '';
  document.getElementById('data_entrada').value = cliente.data_entrada || '';
  document.getElementById('data_saida').value = cliente.data_saida || '';
  document.getElementById('sistema').value = cliente.sistema || '';
  // Configurar checkboxes de tipo_servico
  document.querySelectorAll('#tipo_servico input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = Array.isArray(cliente.tipo_servico) && cliente.tipo_servico.includes(checkbox.value);
  });
  document.getElementById('clienteIndex').value = id;
  modal.show();
}

function excluirCliente(id) {
  if (confirm('Deseja excluir este cliente?')) {
    fetch(`${API_BASE_URL}/api/clientes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        showSuccessToast('Cliente excluído com sucesso!');
        renderizarClientes();
      } else {
        showErrorToast(result.error || 'Erro ao excluir cliente.');
      }
    })
    .catch(error => {
      showErrorToast('Erro ao excluir cliente: ' + error.message);
    });
  }
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Lista de Clientes', 20, 10);
  doc.autoTable({
    head: [['Código', 'Nome', 'Razão Social', 'CPF/CNPJ', 'Estado', 'Status', 'Segmento', 'Sistema', 'Tipo de Serviço']],
    body: clientes.map(cliente => [
      cliente.codigo || '',
      cliente.nome || '',
      cliente.razao_social || '',
      cliente.cpf_cnpj || '',
      cliente.estado || '',
      cliente.status || '',
      cliente.segmento || '',
      cliente.sistema || '',
      Array.isArray(cliente.tipo_servico) ? cliente.tipo_servico.join(', ') : ''
    ])
  });
  doc.save('clientes.pdf');
}

function exportarJSON() {
  const dataStr = JSON.stringify(clientes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clientes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function filtrarClientes() {
  paginaAtual = 1;
  renderizarClientes();
}

function irParaPrimeiraPagina() {
  paginaAtual = 1;
  renderizarClientes();
}

function irParaPaginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarClientes();
  }
}

function irParaProximaPagina() {
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    renderizarClientes();
  }
}

function irParaUltimaPagina() {
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);
  paginaAtual = totalPaginas || 1;
  renderizarClientes();
}

function showSuccessToast(message) {
  const toast = document.getElementById('successToast');
  document.getElementById('successToastMessage').textContent = message;
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

function showErrorToast(message) {
  const toast = document.getElementById('errorToast');
  document.getElementById('errorToastMessage').textContent = message;
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

function inicializarEventos() {
  const filtroInput = document.getElementById('filtroInput');
  const fileInput = document.getElementById('fileInput');
  const clienteForm = document.getElementById('clienteForm');

  const missingElements = [];
  if (!filtroInput) missingElements.push('filtroInput');
  if (!fileInput) missingElements.push('fileInput');
  if (!clienteForm) missingElements.push('clienteForm');

  if (missingElements.length > 0) {
    console.error('Elementos DOM faltando:', missingElements);
    showErrorToast(`Erro: Elementos não encontrados no HTML: ${missingElements.join(', ')}`);
    return;
  }

  filtroInput.addEventListener('input', filtrarClientes);
  fileInput.addEventListener('change', (e) => importarClientes(e.target.files));

  clienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tipoServico = Array.from(document.querySelectorAll('#tipo_servico input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const cliente = {
      codigo: document.getElementById('codigo').value,
      nome: document.getElementById('nome').value,
      razao_social: document.getElementById('razao_social').value,
      cpf_cnpj: document.getElementById('cpf_cnpj').value,
      regime_fiscal: document.getElementById('regime_fiscal').value,
      situacao: document.getElementById('situacao').value,
      tipo_pessoa: document.getElementById('tipo_pessoa').value,
      estado: document.getElementById('estado').value,
      municipio: document.getElementById('municipio').value,
      status: document.getElementById('status').value,
      possui_ie: document.getElementById('possui_ie').value,
      ie: document.getElementById('ie').value,
      filial: document.getElementById('filial').value,
      empresa_matriz: document.getElementById('empresa_matriz').value,
      grupo: document.getElementById('grupo').value,
      segmento: document.getElementById('segmento').value,
      data_entrada: document.getElementById('data_entrada').value,
      data_saida: document.getElementById('data_saida').value,
      sistema: document.getElementById('sistema').value,
      tipo_servico: tipoServico.length > 0 ? tipoServico : null
    };
    const id = document.getElementById('clienteIndex').value;

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_BASE_URL}/api/clientes/${id}` : `${API_BASE_URL}/api/clientes`;
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cliente)
      });
      const result = await response.json();
      if (result.success) {
        showSuccessToast(id ? 'Cliente atualizado com sucesso!' : 'Cliente adicionado com sucesso!');
        renderizarClientes();
        bootstrap.Modal.getInstance(document.getElementById('clienteModal')).hide();
      } else {
        showErrorToast(result.error || 'Erro ao salvar cliente.');
      }
    } catch (error) {
      showErrorToast('Erro ao salvar cliente: ' + error.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, iniciando eventos...');
  renderNavbar();
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === 'index.html') {
    inicializarEventos();
    renderizarClientes();
  }
});