// API Configuration
const API_URL = 'http://localhost:5000/api';

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
  
  if (token) {
    // Remove login button if exists
    const loginBtn = navContainer.querySelector('.login-btn');
    if (loginBtn) loginBtn.remove();
    
    // Add user info and logout
    const userInfo = document.createElement('span');
    userInfo.className = 'user-info';
    userInfo.textContent = localStorage.getItem('userName') || 'User';
    userInfo.style.margin = '0 0.5rem';
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn-logout';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.padding = '0.5rem 1rem';
    logoutBtn.style.border = 'none';
    logoutBtn.style.borderRadius = '0.375rem';
    logoutBtn.style.background = 'transparent';
    logoutBtn.style.color = 'var(--gray-700)';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.addEventListener('click', handleLogout);
    
    navContainer.appendChild(userInfo);
    navContainer.appendChild(logoutBtn);
  } else {
    // Add login button
    const loginBtn = document.createElement('a');
    loginBtn.href = '/login';
    loginBtn.className = 'login-btn';
    loginBtn.textContent = 'Login';
    loginBtn.style.padding = '0.5rem 1rem';
    loginBtn.style.borderRadius = '0.375rem';
    loginBtn.style.background = 'var(--primary-600)';
    loginBtn.style.color = 'white';
    loginBtn.style.textDecoration = 'none';
    
    navContainer.appendChild(loginBtn);
  }
}

function handleLogout() {
  removeToken();
  localStorage.removeItem('userName');
  window.location.href = '/';
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
      showAlert('Login successful!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
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
      showAlert('Account created successfully!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
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

