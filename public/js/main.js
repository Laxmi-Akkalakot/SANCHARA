// API Configuration
const API_URL = 'http://localhost:5000/api';
const AUTH_REDIRECT_KEY = 'redirectAfterLogin';

// Utility Functions
function showAlert(message, type = 'error') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const form = document.querySelector('form');
  if (form) {
    form.insertBefore(alertDiv, form.firstChild);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}

function showSuccessMessage(title, message) {
  // Remove any existing success overlay
  const existing = document.getElementById('success-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'success-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
  `;
  
  const successCard = document.createElement('div');
  successCard.style.cssText = `
    background: white;
    border-radius: 1.5rem;
    padding: 3rem;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
    animation: scaleIn 0.3s ease-out;
  `;
  
  const icon = document.createElement('div');
  icon.style.cssText = `
    width: 5rem;
    height: 5rem;
    border-radius: 9999px;
    background: linear-gradient(to bottom right, #10b981, #059669);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 2.5rem;
  `;
  icon.innerHTML = '✓';
  
  const titleEl = document.createElement('h2');
  titleEl.textContent = title;
  titleEl.style.cssText = `
    font-size: 2rem;
    font-weight: bold;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
  `;
  
  const messageEl = document.createElement('p');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    color: var(--gray-600);
    font-size: 1.125rem;
  `;
  
  successCard.appendChild(icon);
  successCard.appendChild(titleEl);
  successCard.appendChild(messageEl);
  overlay.appendChild(successCard);
  document.body.appendChild(overlay);
  
  // Add animation styles if not already present
  if (!document.getElementById('success-animations')) {
    const style = document.createElement('style');
    style.id = 'success-animations';
    style.textContent = `
      @keyframes scaleIn {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function isAuthenticated() {
  return !!getToken();
}

function rememberRedirect(pathname = '/chatbot') {
  localStorage.setItem(AUTH_REDIRECT_KEY, pathname);
}

function consumeRedirect(defaultPath = '/chatbot') {
  const redirectPath = localStorage.getItem(AUTH_REDIRECT_KEY) || defaultPath;
  localStorage.removeItem(AUTH_REDIRECT_KEY);
  return redirectPath;
}

// Navigation
function initNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }
  
  // Update nav based on authentication
  updateNavForAuth();
}

function updateNavForAuth() {
  const token = getToken();
  const navContainer = document.querySelector('.nav-links');
  
  if (!navContainer) return;
  
  navContainer.querySelectorAll('.auth-only').forEach(node => node.remove());

  if (token) {
    const userInfo = document.createElement('span');
    userInfo.className = 'user-info auth-only';
    userInfo.textContent = localStorage.getItem('userName') || 'User';
    userInfo.style.margin = '0 0.5rem';

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn-logout auth-only';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.padding = '0.5rem 1rem';
    logoutBtn.style.border = 'none';
    logoutBtn.style.borderRadius = '0.375rem';
    logoutBtn.style.background = 'var(--gray-100)';
    logoutBtn.style.color = 'var(--gray-700)';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.addEventListener('click', handleLogout);

    navContainer.appendChild(userInfo);
    navContainer.appendChild(logoutBtn);
  } else {
    const loginBtn = document.createElement('a');
    loginBtn.href = '/login';
    loginBtn.className = 'login-btn auth-only';
    loginBtn.textContent = 'Login';
    loginBtn.style.padding = '0.5rem 1rem';
    loginBtn.style.borderRadius = '0.375rem';
    loginBtn.style.background = 'var(--primary-600)';
    loginBtn.style.color = 'white';
    loginBtn.style.textDecoration = 'none';

    const signupBtn = document.createElement('a');
    signupBtn.href = '/register';
    signupBtn.className = 'signup-btn auth-only';
    signupBtn.textContent = 'Sign Up';
    signupBtn.style.padding = '0.5rem 1rem';
    signupBtn.style.borderRadius = '0.375rem';
    signupBtn.style.border = '1px solid var(--primary-600)';
    signupBtn.style.color = 'var(--primary-600)';
    signupBtn.style.marginLeft = '0.5rem';
    signupBtn.style.textDecoration = 'none';

    navContainer.appendChild(loginBtn);
    navContainer.appendChild(signupBtn);
  }
}

function handleLogout() {
  removeToken();
  localStorage.removeItem('userName');
  localStorage.removeItem(AUTH_REDIRECT_KEY);
  window.location.href = '/';
}

function enforceAuthForChatbot() {
  if (window.location.pathname === '/chatbot' && !isAuthenticated()) {
    rememberRedirect('/chatbot');
    window.location.href = '/login';
  }
}

function initProtectedCtas() {
  const getStartedBtn = document.getElementById('get-started-btn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', (e) => {
      if (!isAuthenticated()) {
        e.preventDefault();
        rememberRedirect('/chatbot');
        window.location.href = '/login';
      }
    });
  }
}

// Authentication
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.textContent = 'Signing In...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setToken(data.token);
      if (data.name) {
        localStorage.setItem('userName', data.name);
      }
      // Show logged in message
      showSuccessMessage('Logged In', 'You have successfully logged in!');
      setTimeout(() => {
        window.location.href = consumeRedirect('/chatbot');
      }, 2000);
    } else {
      showAlert(data.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (password !== confirmPassword) {
    showAlert('Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.textContent = 'Creating Account...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setToken(data.token);
      if (data.name) {
        localStorage.setItem('userName', data.name);
      }
      // Show sign up completed message
      showSuccessMessage('Sign Up Completed', 'Your account has been created successfully!');
      setTimeout(() => {
        window.location.href = consumeRedirect('/chatbot');
      }, 2000);
    } else {
      showAlert(data.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function handleContact(e) {
  e.preventDefault();
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert('Message sent successfully! We will get back to you soon.', 'success');
      e.target.reset();
    } else {
      showAlert(data.message || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  enforceAuthForChatbot();
  initProtectedCtas();
  
  // Form handlers
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContact);
  }
});

