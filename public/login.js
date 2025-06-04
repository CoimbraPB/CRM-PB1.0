const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';

function showErrorToast(message) {
  const toast = document.getElementById('errorToast');
  const toastMessage = document.getElementById('errorToastMessage');
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  } else {
    console.error('Toast elements not found:', { toast, toastMessage });
    alert(message); // Fallback para erros críticos
  }
}

function login(event) {
  event.preventDefault();
  console.log('Login function called');

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!emailInput || !passwordInput) {
    console.error('Form elements not found:', { emailInput, passwordInput });
    showErrorToast('Erro: Campos de email ou senha não encontrados.');
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showErrorToast('Por favor, preencha email e senha.');
    return;
  }

  console.log('Attempting login with:', { email });

  fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(response => {
      console.log('Login response:', response.status);
      if (!response.ok) throw new Error(`HTTP error - Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('permissao', data.permissao);

      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || 'index.html';
      console.log('Redirecting to:', redirectUrl);
      window.location.href = redirectUrl;
    })
    .catch(error => {
      console.error('Erro ao fazer login:', error);
      showErrorToast('Credenciais inválidas ou erro no servidor.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - Initializing login form');
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', login);
    console.log('Login form found and event listener attached');
  } else {
    console.error('Login form not found (#loginForm)');
    showErrorToast('Erro: Formulário de login não encontrado.');
  }
});