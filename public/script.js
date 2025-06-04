const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';

async function renderizarClientes() {
  const clientesBody = document.getElementById('clientesBody');
  const paginacaoInfo = document.getElementById('paginacaoInfo');
  if (!clientesBody || !paginacaoInfo) {
    console.error('Elementos DOM não encontrados:', { clientesBody, paginacaoInfo });
    showErrorToast('Erro: Interface não carregada corretamente.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/clientes`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const clientes = await response.json();
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
      (cliente.grupo || '').toLowerCase().includes(filtro)
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

function importarClientes() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    const files = e.target.files;
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
            headers: { 'Content-Type': 'application/json' },
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
  };
  input.click();
}

function editarCliente(id) {
  showErrorToast('Funcionalidade de edição não implementada.');
}

function excluirCliente(id) {
  if (confirm('Deseja excluir este cliente?')) {
    fetch(`${API_BASE_URL}/api/clientes/${id}`, {
      method: 'DELETE'
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

function showSuccessToast(message) {
  alert(message); // Substituir por toast personalizado
}

function showErrorToast(message) {
  alert(message); // Substituir por toast personalizado
}

function inicializarEventos() {
  const filtroInput = document.getElementById('filtroInput');
  const importarBtn = document.getElementById('importarBtn');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');

  if (!filtroInput || !importarBtn || !prevPage || !nextPage) {
    console.error('Elementos de interação não encontrados:', { filtroInput, importarBtn, prevPage, nextPage });
    showErrorToast('Erro: Interface não carregada corretamente. Verifique os IDs no HTML.');
    return;
  }

  filtroInput.addEventListener('input', () => {
    paginaAtual = 1;
    renderizarClientes();
  });

  importarBtn.addEventListener('click', importarClientes);

  prevPage.addEventListener('click', () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      renderizarClientes();
    }
  });

  nextPage.addEventListener('click', () => {
    paginaAtual++;
    renderizarClientes();
  });
}

let paginaAtual = 1;
const clientesPorPagina = 10;

document.addEventListener('DOMContentLoaded', () => {
  inicializarEventos();
  renderizarClientes();
});