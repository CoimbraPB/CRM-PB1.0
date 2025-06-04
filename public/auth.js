const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://crm-pb-web.onrender.com';

function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (!token && currentPage !== 'login.html') {
    // Salvar a URL atual para redirecionamento após login
    const redirectUrl = window.location.href;
    window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
  }
}

// Executar verificação ao carregar a página
document.addEventListener('DOMContentLoaded', checkAuth);