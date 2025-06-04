const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';

async function renderizarClientes() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clientes`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const clientes = await response.json();
    clientesBody.innerHTML = '';
    const filtro = filtroInput.value.toLowerCase();
    const clientesFiltrados = clientes.filter(cliente => 
      cliente.codigo.toLowerCase().includes(filtro) ||
      cliente.nome.toLowerCase().includes(filtro) ||
      cliente.razao_social.toLowerCase().includes(filtro) ||
      cliente.cpf_cnpj.toLowerCase().includes(filtro) ||
      cliente.situacao.toLowerCase().includes(filtro) ||
      cliente.municipio.toLowerCase().includes(filtro) ||
      cliente.status.toLowerCase().includes(filtro) ||
      cliente.grupo.toLowerCase().includes(filtro)
    );

    const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
    paginaAtual = Math.min(paginaAtual, totalPaginas || 1);

    const inicio = (paginaAtual - 1) * clientesPorPagina;
    const fim = inicio + clientesPorPagina;
    const clientesPagina = clientesFiltrados.slice(inicio, fim);

    clientesPagina.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cliente.codigo}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.razao_social || ''}</td>
        <td>${cliente.cpf_cnpj}</td>
        <td>${cliente.regime_fiscal}</td>
        <td>${cliente.situacao}</td>
        <td>${cliente.tipo_pessoa}</td>
        <td>${cliente.estado}</td>
        <td>${cliente.municipio || ''}</td>
        <td>${cliente.status}</td>
        <td>${cliente.possui_ie}</td>
        <td>${cliente.ie || ''}</td>
        <td>${cliente.filial || ''}</td>
        <td>${cliente.empresa_matriz || ''}</td>
        <td>${cliente.grupo || ''}</td>
        <td>
          <button class="btn btn-primary btn-sm me-1" onclick="editarCliente(${cliente.id})" title="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="excluirCliente(${cliente.id})" title="Excluir">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      clientesBody.appendChild(tr);
    });

    paginacaoInfo.textContent = `Página ${paginaAtual} de ${totalPaginas} (${clientesFiltrados.length} clientes)`;
  } catch (error) {
    showErrorToast(`Erro ao carregar clientes: ${error.message}`);
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
  // Implementar lógica de edição
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
  alert(message); // Placeholder
}

function showErrorToast(message) {
  alert(message); // Placeholder
}

const clientesBody = document.getElementById('clientesBody');
const filtroInput = document.getElementById('filtroInput');
const paginacaoInfo = document.getElementById('paginacaoInfo');
let paginaAtual = 1;
const clientesPorPagina = 10;

filtroInput.addEventListener('input', () => {
  paginaAtual = 1;
  renderizarClientes();
});

document.getElementById('importarBtn').addEventListener('click', importarClientes);
document.getElementById('prevPage').addEventListener('click', () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarClientes();
  }
});
document.getElementById('nextPage').addEventListener('click', () => {
  paginaAtual++;
  renderizarClientes();
});

renderizarClientes();