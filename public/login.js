const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';

function showErrorToast(message) {
  const toast = document.getElementById('errorToast');
  document.getElementById('errorToastMessage').textContent = message;
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

function login(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(response => {
      if (!response.ok) throw new Error('Credenciais inválidas');
      return response.json();
    })
    .then(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('permissao', data.permissao);

      // Obter URL de redirecionamento da query string
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || 'index.html';
      window.location.href = redirectUrl;
    })
    .catch(error => {
      console.error('Erro ao fazer login:', error);
      showErrorToast('Credenciais inválidas ou erro no servidor.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', login);
});