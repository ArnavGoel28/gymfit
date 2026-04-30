const API_URL = '/api';

function getAuthToken() {
    return localStorage.getItem('token');
}

function showToast(message, isError = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.borderLeft = `4px solid ${isError ? 'var(--action-color)' : 'var(--action-hover)'}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/views/login.html';
    }
    return token;
}

function getAuthUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'x-auth-token': getAuthToken()
    };
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/views/login.html';
}

function setupNav() {
    const user = getAuthUser();
    const navRight = document.getElementById('nav-right');
    if (user && navRight) {
        navRight.innerHTML = `
            <span style="margin-right:1rem;color:var(--text-muted)">Hi, ${user.name}</span>
            <a href="#" class="auth-btn" style="background:var(--action-color)" onclick="logout()">Logout</a>
        `;
    }
}

// Ensure Inter font is loaded dynamically if needed, but standard is fine
document.addEventListener('DOMContentLoaded', () => {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    head.appendChild(link);
});
