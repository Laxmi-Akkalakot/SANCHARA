const STORAGE_KEY = 'sancharaUser';
const SESSION_KEY = 'sancharaSession';
const OUTPUT_ID = 'output';

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  const page = document.body.dataset.page;
  if (!page) return;

  const handlers = {
    signup: initSignup,
    login: initLogin,
    assistant: initAssistant,
  };

  handlers[page]?.();
});

function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function getUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setSession(active) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ active }));
}

function isLoggedIn() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    return JSON.parse(raw).active;
  } catch {
    return false;
  }
}

function initSignup() {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const phone = form.phone.value.trim();

    if (!username || !password || !phone) {
      showAlert('Please fill in all fields.');
      return;
    }

    saveUser({ username, password, phone });
    alert('Register Successfully!');
    window.location.href = 'index.html';
  });
}

function initLogin() {
  const form = document.getElementById('login-form');
  const user = getUser();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!user) {
      showAlert('No account found. Please sign up first.');
      return;
    }

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (username === user.username && password === user.password) {
      showAlert('Login Successful!', 'success');
      setSession(true);
      setTimeout(() => (window.location.href = 'assistant.html'), 1000);
    } else {
      showAlert('Invalid credentials. Try again.');
    }
  });
}

function initAssistant() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  attachAction('btn-location', handleLiveLocation);
  attachAction('btn-hospital', () => handleSearch('hospital'));
  attachAction('btn-medical', () => handleSearch('medical'));
  attachAction('btn-weather', handleWeather);
  attachAction('btn-sos', handleSOS);
  attachAction('btn-voice-en', () => speak('Hello! How can I help you today?', 'en-IN'));
  attachAction('btn-voice-kn', () => speak('ನಮಸ್ಕಾರ! ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?', 'kn-IN'));
  attachAction('btn-offline', () =>
    showOutput('📴 Offline mode ready. This app keeps working even without internet.')
  );
}

function attachAction(id, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', handler);
}

function showAlert(message, type = 'error') {
  let alertBox = document.querySelector('.alert');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.className = 'alert';
    document.querySelector('.shell').prepend(alertBox);
  }
  alertBox.style.background = type === 'success' ? 'rgba(40,167,69,0.15)' : 'rgba(255,82,82,0.15)';
  alertBox.style.borderColor = type === 'success' ? 'rgba(40,167,69,0.25)' : 'rgba(255,82,82,0.25)';
  alertBox.textContent = message;
}

function showOutput(html) {
  const output = document.getElementById(OUTPUT_ID);
  if (!output) return;
  output.innerHTML = typeof html === 'string' ? html : '';
}

function handleLiveLocation() {
  if (!navigator.geolocation) {
    showOutput('Geolocation not supported in this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      showOutput(
        `📍 Latitude: ${latitude.toFixed(5)}<br>📍 Longitude: ${longitude.toFixed(
          5
        )}<br><a class="link" href="${mapUrl}" target="_blank">Open in Google Maps</a>`
      );
      sessionStorage.setItem('sancharaCoords', JSON.stringify({ latitude, longitude }));
    },
    () => showOutput('Unable to access your location. Please allow permission.')
  );
}

function getCachedCoords() {
  const raw = sessionStorage.getItem('sancharaCoords');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function handleSearch(type) {
  const coords = getCachedCoords();
  const fallback = 'https://www.google.com/maps/search/';
  if (!coords) {
    showOutput('Please tap Live Location first to fetch nearby places.');
    window.open(`${fallback}${type}`, '_blank');
    return;
  }
  const query =
    type === 'hospital'
      ? `https://www.google.com/maps/search/hospital/@${coords.latitude},${coords.longitude},15z`
      : `https://www.google.com/maps/search/medical+shop/@${coords.latitude},${coords.longitude},15z`;
  window.open(query, '_blank');
  showOutput(
    `Opened nearby ${type === 'hospital' ? 'hospitals' : 'medical shops'} in Google Maps.`
  );
}

async function handleWeather() {
  const coords = getCachedCoords() || { latitude: 12.9716, longitude: 77.5946 };
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`;
  showOutput('Fetching weather...');
  try {
    const res = await fetch(url);
    const data = await res.json();
    const weather = data.current_weather;
    showOutput(
      `⛅ Temperature: ${weather.temperature}°C<br>🌬️ Wind: ${weather.windspeed} km/h<br>🧭 Direction: ${weather.winddirection}°`
    );
  } catch (err) {
    showOutput('Weather service unavailable. Try again.');
  }
}

function handleSOS() {
  const user = getUser();
  if (!user?.phone) {
    showOutput('Add a family phone number during signup to use SOS.');
    return;
  }
  const encoded = encodeURIComponent(
    'Emergency! I need help. Please contact me immediately.'
  );
  const url = `https://wa.me/${user.phone.replace(/\D/g, '')}?text=${encoded}`;
  window.open(url, '_blank');
  showOutput('SOS alert prepared in WhatsApp for your family contact.');
}

function speak(text, lang) {
  if (!('speechSynthesis' in window)) {
    showOutput('Speech Synthesis is not supported in this browser.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
  showOutput(`🎤 Voice assistant responded in ${lang.includes('kn') ? 'Kannada' : 'English'}.`);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW failed', err));
  }
}

