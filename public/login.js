const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';

function showErrorToast(message) {
  const toast = document.getElementById('errorToast');
  document.getElementById('errorToastMessage').textContent = message;
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) {
    console.error('Formulário de login não encontrado');
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('permissao', result.permissao);
        if (result.permissao === 'Gestor') {
          window.location.href = 'ocorrencias-gestor.html';
        } else if (result.permissao === 'Gerente') {
          window.location.href = 'historico-ocorrencias.html';
        }
      } else {
        showErrorToast(result.error || 'Erro ao autenticar');
      }
    } catch (error) {
      showErrorToast('Erro ao autenticar: ' + error.message);
    }
  });
});