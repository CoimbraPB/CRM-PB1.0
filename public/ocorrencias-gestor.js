const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';

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

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('permissao');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const permissao = localStorage.getItem('permissao');
  if (!token || permissao !== 'Gestor') {
    showErrorToast('Acesso negado. Faça login como Gestor.');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }

  const form = document.getElementById('ocorrenciaForm');
  const advertidoSelect = document.getElementById('advertido');
  const tipoAdvertenciaContainer = document.getElementById('tipo_advertencia_container');
  const advertenciaOutraContainer = document.getElementById('advertencia_outra_container');
  const tipoAdvertenciaSelect = document.getElementById('tipo_advertencia');
  const clienteComunicadoSelect = document.getElementById('cliente_comunicado');
  const meioComunicacaoContainer = document.getElementById('meio_comunicacao_container');
  const comunicacaoOutroContainer = document.getElementById('comunicacao_outro');
  const meioComunicacaoSelect = document.getElementById('meio_comunicacao');

  advertidoSelect.addEventListener('change', () => {
    tipoAdvertenciaContainer.style.display = advertidoSelect.value === 'Sim' ? 'block' : 'none';
    advertenciaOutraContainer.style.display = advertidoSelect.value === 'Outra' && advertidoSelect.value === 'Sim' ? 'block' : 'none';
  });

  tipoAdvertenciaSelect.addEventListener('change', () => {
    advertenciaOutraContainer.style.display = tipoAdvertenciaSelect.value === 'Outra' ? 'block' : 'none';
  });

  clienteComunicadoSelect.addEventListener('change', () => {
    meioComunicacaoContainer.style.display = clienteComunicadoSelect.value === 'Sim' ? 'block' : 'none';
    comunicacaoOutroContainer.style.display = meioComunicacaoSelect.value === 'Outro' && clienteComunicadoSelect.value === 'Sim' ? 'block' : 'none';
  });

  meioSelectComunicacaoSelect.addEventListener('change', () => {
    comunicacaoOutroContainer.style.display = meioComunicacaoSelect.value === 'Outro' ? 'block' : 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ocorrencia = {
      data_ocorrencia: document.getElementById('data_ocorrencia').value,
      setor: document.getElementById('setor').value,
      descricao: document.getElementById('descricao').value,
      cliente_impactado: document.getElementById('cliente_impactado').value,
      valor_desconto: document.getElementById('valor_desconto').value,
      tipo_desconto: document.querySelector('input[name="tipo_desconto"]:checked')?.value,
      colaborador_nome: document.getElementById('colaborador_nome').value,
      colaborador_cargo: document.getElementById('colaborador_cargo').value,
      advertido: document.getElementById('advertido').value,
      tipo_advertencia: advertidoSelect.value === 'Sim' ? document.getElementById('tipo_advertencia').value : '',
      advertencia_outra: tipoAdvertenciaSelect.value === 'Outra' ? document.getElementById('advertencia_outra').value : '',
      cliente_comunicado: document.getElementById('cliente_comunicado').value,
      meio_comunicacao: clienteComunicadoSelect.value === 'Sim' ? document.getElementById('meio_comunicacao').value : '',
      comunicacao_outro: meioComunicacaoSelect.value === 'Outro' ? document.getElementById('comunicacao_outro').value : '',
      acoes_imediatas: document.getElementById('acoes_imediatas').value,
      acoes_corretivas: document.getElementById('acoes_corretivas').value,
      acoes_preventivas: document.getElementById('acoes_preventivas').value,
      responsavel_nome: document.getElementById('responsavel_nome').value,
      responsavel_data: document.getElementById('responsavel_data').value
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api}/ocorrencias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ocorrencia)
      });
      const result = await response.json();
      if (result.success) {
        showSuccessToast('Ocorrência registrada com sucesso!');
        form.reset();
      } else {
        showErrorToast(result.error || 'Erro ao registrar ocorrência.');
      }
    } catch (error) {
      showErrorToast('Erro ao registrar ocorrência: ' + error.message);
    }
  });
});