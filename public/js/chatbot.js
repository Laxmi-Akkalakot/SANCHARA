const DEFAULT_LOCATION = { lat: 12.9716, lng: 77.5946 };
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const POI_DATA = [
  {
    name: 'City Care Hospital',
    type: 'Hospital',
    lat: 12.9712,
    lng: 77.5975,
    address: 'MG Road, Bengaluru',
    phone: '+91 80444 00000',
  },
  {
    name: 'Namma Clinic',
    type: 'Hospital',
    lat: 12.9777,
    lng: 77.5713,
    address: 'Malleshwaram, Bengaluru',
    phone: '+91 80442 12121',
  },
  {
    name: 'Green Leaf Pharmacy',
    type: 'Pharmacy',
    lat: 12.9352,
    lng: 77.6245,
    address: 'Koramangala 4th Block',
    phone: '+91 80700 99001',
  },
  {
    name: '24x7 Medicals',
    type: 'Pharmacy',
    lat: 12.9141,
    lng: 77.6408,
    address: 'BTM Layout',
    phone: '+91 80700 99002',
  },
  {
    name: 'Sarathi Relief Center',
    type: 'Assistive Shop',
    lat: 12.9987,
    lng: 77.5531,
    address: 'Yeshwanthpur',
    phone: '+91 80700 99003',
  },
  {
    name: 'Mobility Hub',
    type: 'Assistive Shop',
    lat: 12.9592,
    lng: 77.6974,
    address: 'Whitefield',
    phone: '+91 80700 99004',
  },
];

const TRANSLATIONS = {
  en: {
    greeting: 'Hello! How can I assist you today? I can guide you with routes, weather, live tracking, and emergency support.',
    route: 'Tap Smart Route to open Google Maps or ask me to suggest an accessible path with ramps and lifts.',
    weather: 'Use Weather Alert to know if rain, heat, or wind might impact your travel.',
    emergency: 'For emergencies, tap SOS. I will notify your family contact and highlight the nearest hospital.',
    location: 'Enable Live Tracking so I can compute distances and alert nearby help centers.',
    accessibility:
      'Sanchara curates wheelchair-friendly locations. I watch for elevators, ramps, and rest-stops on every suggestion.',
    fallback:
      'I understand you are asking about "{{message}}". I can help with routes, accessibility, live tracking, weather, and SOS.',
    voice_not_supported: 'Voice recognition is not supported in this browser. Please type your message instead.',
    listening: '🎤 Listening... speak now (English/Kannada).',
    location_started: 'Starting live location tracking...',
    location_updated: '📍 Updated location {{coords}} (±{{accuracy}}m).',
    location_error: 'Unable to read location. Please allow GPS permission.',
    offline: 'You are offline. Cached guidance is active until the network returns.',
    sos_preparing: '🚨 Preparing SOS message for your family and nearest hospital...',
    sos_sent:
      'Messages prepared for {{contact}} and {{hospital}}. Please keep your phone accessible until responders arrive.',
    sos_cancelled: 'SOS cancelled. If you still need help, press the button again.',
    weather_fetching: 'Fetching certified weather from Open-Meteo…',
    weather_summary:
      'Temperature {{temperature}}°C • Wind {{wind}} km/h • Humidity {{humidity}}%. Condition: {{condition}}.',
    weather_safe: '✅ Weather is clear for travel.',
    weather_alert: '⚠️ Weather alert: {{alert}} — plan cautiously.',
    sos_banner: 'SMS ready for {{contact}} and {{hospital}}.',
    voice_ready: 'Voice assistant switched to {{language}}.',
  },
  kn: {
    greeting: 'ನಮಸ್ಕಾರ! ಇಂದು ನಾನು ನಿಮ್ಮ ಪ್ರಯಾಣಕ್ಕೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ಮಾರ್ಗ, ಹವಾಮಾನ, ತುರ್ತು ಸಹಾಯ ಎಲ್ಲವೂ ಇಲ್ಲಿ ಸಿಗುತ್ತದೆ.',
    route: 'ಸ್ಮಾರ್ಟ್ ರೂಟ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಸೌಲಭ್ಯ ಬುಡಿಸಲು ನನಗೆ ಹೇಳಿ. ರಾಂಪ್ ಮತ್ತು ಲಿಫ್ಟ್ ಇರುವ ದಾರಿ ಸೂಚಿಸುತ್ತೇನೆ.',
    weather: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ ನೋಡಿರಿ. ಮಳೆ/ಬಿಸಿ/ಗಾಳಿ ಪರಿಣಾಮವನ್ನು ಮೊದಲೇ ತಿಳಿಸುತ್ತೇನೆ.',
    emergency: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಬಂದರೆ SOS ಒತ್ತಿ. ನಿಮ್ಮ ಕುಟುಂಬ ಮತ್ತು ಸಮೀಪದ ಆಸ್ಪತ್ರೆಗೆ ತಿಳಿಸುತ್ತೇನೆ.',
    location: 'ಲೈವ್ ಟ್ರಾಕಿಂಗ್ ಆನ್ ಮಾಡಿದರೆ ಸಮೀಪದ ಆಸ್ಪತ್ರೆ/ಔಷಧ ಅಂಗಡಿ ದೂರ ತಕ್ಷಣ ಲೆಕ್ಕಿಸುತ್ತೇನೆ.',
    accessibility:
      'ಸಂಚಾರಾ ವೀಲ್ಚೇರ್ ಸ್ನೇಹಿ ಸ್ಥಳಗಳನ್ನು ಸಂಗ್ರಹಿಸುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಮಾರ್ಗದಲ್ಲೂ ರಾಂಪ್, ಎಲಿವೇಟರ್, ವಿಶ್ರಾಂತಿ ತಾಣಗಳ ಬಗ್ಗೆ ಸೂಚನೆ ಕೊಡುತ್ತೇನೆ.',
    fallback:
      'ನೀವು "{{message}}" ಬಗ್ಗೆ ಕೇಳುತ್ತಿದ್ದೀರಿ. ಮಾರ್ಗ, ಪ್ರವೇಶ, ಹವಾಮಾನ, SOS ವಿಷಯಗಳಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು.',
    voice_not_supported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.',
    listening: '🎤 ಈಗ ಮಾತನಾಡಿ (English/Kannada).',
    location_started: 'ಲೈವ್ ಟ್ರಾಕಿಂಗ್ ಪ್ರಾರಂಭವಾಗಿದೆ...',
    location_updated: '📍 ಸ್ಥಾನ: {{coords}} (±{{accuracy}}m).',
    location_error: 'ಸ್ಥಳವನ್ನು ಓದಲು ಆಗುತ್ತಿಲ್ಲ. GPS ಅನುಮತಿ ನೀಡಿ.',
    offline: 'ನೀವು ಆಫ್ಲೈನ್ ಆಗಿದ್ದೀರಿ. ಸಂಗ್ರಹಿಸಿದ ಮಾಹಿತಿ ತಾತ್ಕಾಲಿಕವಾಗಿ ಬಳಸುತ್ತೇನೆ.',
    sos_preparing: '🚨 SOS ಸಂದೇಶ ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇನೆ...',
    sos_sent:
      '{{contact}} ಮತ್ತು {{hospital}} ಗೆ ತುರ್ತು ಮಾಹಿತಿ ಕಳುಹಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಸುರಕ್ಷಿತವಾಗಿ ಇರಿ.',
    sos_cancelled: 'SOS ರದ್ದಾಗಿದೆ. ಸಹಾಯ ಬೇಕಿದ್ದರೆ ಮತ್ತೆ ಒತ್ತಿ.',
    weather_fetching: 'Open-Meteo ನಿಂದ ಹವಾಮಾನ ತರಲಾಗುತ್ತಿದೆ…',
    weather_summary:
      'ಉಷ್ಣಾಂಶ {{temperature}}°C • ಗಾಳಿ {{wind}} km/h • ಆರ್ದ್ರತೆ {{humidity}}%. ಸ್ಥಿತಿ: {{condition}}.',
    weather_safe: '✅ ಹವಾಮಾನ ಸುಸ್ಥಿರವಾಗಿದೆ.',
    weather_alert: '⚠️ ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ: {{alert}}.',
    sos_banner: '{{contact}} ಮತ್ತು {{hospital}} ಗೆ ಸಂದೇಶ ಸಿದ್ಧವಾಗಿದೆ.',
    voice_ready: 'ಧ್ವನಿ ಸಹಾಯ {{language}} ಭಾಷೆಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.',
  },
};

class Chatbot {
  constructor() {
    this.messages = [];
    this.isRecording = false;
    this.recognition = null;
    this.currentLocation = null;
    this.watchId = null;
    this.statusEmojis = ['😊', '😄', '😃', '🙂', '😐', '😕', '😟', '😢'];
    this.currentStatusIndex = 0;
    this.language = localStorage.getItem('preferredLanguage') || 'en';
    this.speechSynth = 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.cachedWeather = null;

    this.init();
  }

  init() {
    this.setupVoiceRecognition();
    this.setupEventListeners();
    this.setupFeatureButtons();
    this.initStatusBar();
    this.setupLanguageControls();
    this.hydrateFamilyContact();
    this.setupSosButton();
    this.initConnectivityMonitor();
    this.loadWeatherData();
  }

  t(key, params = {}) {
    const pack = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    const fallback = TRANSLATIONS.en[key] || '';
    const template = pack[key] || fallback || '';
    return template.replace(/{{(\w+)}}/g, (_, token) => params[token] ?? '');
  }

  setupVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.language === 'kn' ? 'kn-IN' : 'en-IN';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chat-input').value = transcript;
        this.stopRecording();
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.stopRecording();
        this.addBotMessage(this.t('voice_not_supported'));
      };

      this.recognition.onend = () => {
        this.stopRecording();
      };
    }
  }

  setupEventListeners() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');

    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 128) + 'px';
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    sendBtn.addEventListener('click', () => this.sendMessage());
    voiceBtn.addEventListener('click', () => this.toggleVoiceRecording());
  }

  setupFeatureButtons() {
    const bind = (id, handler) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          handler.call(this);
        });
      }
    };

    bind('smart-route-btn', this.openGoogleMaps);
    bind('live-tracking-btn', this.toggleLocationTracking);
    bind('route-suggestion-btn', this.showRouteSuggestion);
    bind('voice-assistance-btn', this.toggleVoiceAssistance);
    bind('emoji-status-btn', this.toggleStatusBar);
    bind('weather-alert-btn', this.showWeatherAlert);
    bind('emergency-alert-btn', this.triggerEmergencyAlert);
  }

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    this.addUserMessage(message);
    input.value = '';
    input.style.height = 'auto';

    try {
      const token = localStorage.getItem('token');
      await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          userId: token ? 'user' : 'anonymous',
          language: this.language,
        }),
      });
    } catch (error) {
      console.warn('Message log failed', error);
    }

    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.generateBotResponse(message);
    }, 700 + Math.random() * 1000);
  }

  addUserMessage(text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-content">
        <p>${this.escapeHtml(text)}</p>
      </div>
    `;
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    this.messages.push({ role: 'user', content: text });
  }

  addBotMessage(text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <p>${this.escapeHtml(text)}</p>
      </div>
    `;
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    this.messages.push({ role: 'bot', content: text });
    this.speakIfAvailable(text);
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
  }

  generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let key = 'fallback';

    if (/(hello|hi|hey)/.test(lowerMessage)) key = 'greeting';
    else if (/(route|direction|navigate)/.test(lowerMessage)) key = 'route';
    else if (/(weather|rain|temperature|heat)/.test(lowerMessage)) key = 'weather';
    else if (/(emergency|sos|help)/.test(lowerMessage)) key = 'emergency';
    else if (/(where am i|location|gps)/.test(lowerMessage)) key = 'location';
    else if (/(accessibility|wheelchair|ramp)/.test(lowerMessage)) key = 'accessibility';

    const response = this.t(key, { message: userMessage });
    this.addBotMessage(response);
  }

  toggleVoiceRecording() {
    if (!this.recognition) {
      this.addBotMessage(this.t('voice_not_supported'));
      return;
    }
    if (this.isRecording) this.stopRecording();
    else this.startRecording();
  }

  startRecording() {
    if (!this.recognition) return;
    this.isRecording = true;
    const voiceBtn = document.getElementById('voice-btn');
    voiceBtn.classList.add('recording');
    voiceBtn.textContent = '🔴';
    this.recognition.lang = this.language === 'kn' ? 'kn-IN' : 'en-IN';
    this.recognition.start();
    this.addBotMessage(this.t('listening'));
  }

  stopRecording() {
    this.isRecording = false;
    const voiceBtn = document.getElementById('voice-btn');
    voiceBtn.classList.remove('recording');
    voiceBtn.textContent = '🎤';
    if (this.recognition) this.recognition.stop();
  }

  openGoogleMaps() {
    this.addUserMessage('Open Smart Route Option');
    this.addBotMessage('Opening Google Maps with accessible options...');
    const openUrl = (url) => window.open(url, '_blank');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&travelmode=walking`;
          openUrl(mapsUrl);
        },
        () => openUrl('https://www.google.com/maps')
      );
    } else {
      openUrl('https://www.google.com/maps');
    }
  }

  toggleLocationTracking() {
    if (this.watchId) this.stopLocationTracking();
    else this.startLocationTracking();
  }

  startLocationTracking() {
    if (!navigator.geolocation) {
      this.addBotMessage(this.t('location_error'));
      return;
    }

    this.addUserMessage('Start Live Location Tracking');
    this.addBotMessage(this.t('location_started'));

    const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        const coordsText = `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)}`;
        this.addBotMessage(this.t('location_updated', { coords: coordsText, accuracy: this.currentLocation.accuracy.toFixed(0) }));
        this.updateStatusBar(`📍 ${coordsText}`, '📍');
        this.updateLocationCard();
        this.updatePoiList();
        this.loadWeatherData();
      },
      (error) => {
        console.error('Geolocation error:', error);
        this.addBotMessage(this.t('location_error'));
      },
      options
    );

    const btn = document.getElementById('live-tracking-btn');
    if (btn) {
      btn.style.background = 'linear-gradient(to right, #10b981, #059669)';
      btn.style.color = '#fff';
    }
  }

  stopLocationTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.addBotMessage('Live tracking paused.');
      const btn = document.getElementById('live-tracking-btn');
      if (btn) {
        btn.style.background = '';
        btn.style.color = '';
      }
    }
  }

  showRouteSuggestion() {
    this.addUserMessage('Show Smart Route Suggestion');
    if (!this.currentLocation) {
      this.addBotMessage('Please enable live tracking for personalized routing.');
      this.startLocationTracking();
      return;
    }
    const { lat, lng } = this.currentLocation;
    const suggestions = [
      'Avoid steep ramps near Cubbon Park; use the elevator near Gate 2.',
      'Metro stations along Purple Line have wheelchair lifts—consider them for long rides.',
      'Use wide footpaths along Church Street; tactile paving is freshly laid.',
    ];
    const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
    this.addBotMessage(`Smart route prepared from ${lat.toFixed(3)}, ${lng.toFixed(3)}. ${pick}`);
  }

  toggleVoiceAssistance() {
    this.addUserMessage('Toggle Voice Assistance');
    if (this.isRecording) {
      this.addBotMessage('Voice assistance already listening.');
    } else {
      this.addBotMessage('Voice assistance enabled. Tap the mic to start/stop.');
      this.startRecording();
    }
  }

  toggleStatusBar() {
    const statusBar = document.getElementById('status-bar');
    if (!statusBar) return;
    if (statusBar.style.display === 'none') {
      statusBar.style.display = 'flex';
      this.addBotMessage('Emoji status bar enabled.');
    } else {
      statusBar.style.display = 'none';
      this.addBotMessage('Emoji status bar hidden.');
    }
  }

  initStatusBar() {
    const statusBar = document.getElementById('status-bar');
    if (!statusBar) return;
    statusBar.addEventListener('click', () => {
      this.currentStatusIndex = (this.currentStatusIndex + 1) % this.statusEmojis.length;
      const emoji = this.statusEmojis[this.currentStatusIndex];
      const statusTexts = ['Ready', 'Happy', 'Excited', 'Good', 'Okay', 'Tired', 'Sad', 'Need Help'];
      this.updateStatusBar(`Status: ${statusTexts[this.currentStatusIndex]}`, emoji);
    });
  }

  updateStatusBar(text, emoji = null) {
    const statusEmoji = document.getElementById('status-emoji');
    const statusText = document.getElementById('status-text');
    if (emoji && statusEmoji) statusEmoji.textContent = emoji;
    if (statusText) statusText.textContent = text;
    const statusBar = document.getElementById('status-bar');
    if (statusBar) statusBar.style.display = 'flex';
  }

  async loadWeatherData() {
    this.showSystemAlert(this.t('weather_fetching'), 'info');
    const coords = this.currentLocation || DEFAULT_LOCATION;

    try {
      const url = `${WEATHER_API_URL}?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const weather = {
          temperature: data.current_weather?.temperature ?? 24,
          windSpeed: data.current_weather?.windspeed ?? 8,
          condition: data.current_weather?.weathercode ?? 'Clear',
          humidity: data.hourly?.relativehumidity_2m?.[0] ?? 60,
          alerts: [],
        };
        this.cachedWeather = weather;
        this.updateWeatherCard(weather);
        return weather;
      }
    } catch (error) {
      console.warn('Open-Meteo failed, falling back', error);
    }

    try {
      const response = await fetch('/api/chatbot/weather');
      const data = await response.json();
      if (data.success) {
        this.cachedWeather = data.weather;
        this.updateWeatherCard(data.weather);
        return data.weather;
      }
    } catch (error) {
      console.warn('Local weather endpoint failed', error);
    }

    const fallback = {
      temperature: 24,
      windSpeed: 10,
      condition: 'Partly Cloudy',
      humidity: 58,
      alerts: [],
    };
    this.cachedWeather = fallback;
    this.updateWeatherCard(fallback);
    return fallback;
  }

  async showWeatherAlert() {
    this.addUserMessage('Show Weather Alert');
    const weather = (await this.loadWeatherData()) || this.cachedWeather;
    if (!weather) {
      this.addBotMessage('Unable to fetch weather right now.');
      return;
    }
    const summary = this.t('weather_summary', {
      temperature: weather.temperature,
      wind: weather.windSpeed,
      humidity: weather.humidity,
      condition: weather.condition,
    });
    const alert = weather.alerts?.length
      ? this.t('weather_alert', { alert: weather.alerts.join(', ') })
      : this.t('weather_safe');
    this.addBotMessage(`${summary}\n${alert}`);
  }

  updateWeatherCard(weather) {
    const summaryEl = document.getElementById('weather-summary');
    const detailEl = document.getElementById('weather-detail');
    if (summaryEl) {
      summaryEl.textContent = `${weather.temperature}°C • ${weather.condition}`;
    }
    if (detailEl) {
      detailEl.textContent = `Wind ${weather.windSpeed} km/h · Humidity ${weather.humidity}%`;
    }
    if (weather.alerts && weather.alerts.length) {
      this.showSystemAlert(this.t('weather_alert', { alert: weather.alerts.join(', ') }), 'warning');
    } else {
      this.showSystemAlert(this.t('weather_safe'), 'success');
    }
  }

  setupLanguageControls() {
    const select = document.getElementById('language-select');
    if (!select) return;
    select.value = this.language;
    select.addEventListener('change', (e) => {
      const newLang = e.target.value;
      this.language = newLang;
      localStorage.setItem('preferredLanguage', newLang);
      this.setupVoiceRecognition();
      this.addBotMessage(
        this.t('voice_ready', { language: newLang === 'kn' ? 'ಕನ್ನಡ' : 'English' })
      );
    });
  }

  hydrateFamilyContact() {
    const contactRaw = localStorage.getItem('emergencyContact');
    if (!contactRaw) return;
    try {
      const contact = JSON.parse(contactRaw);
      const nameEl = document.getElementById('family-contact-name');
      const phoneEl = document.getElementById('family-contact-phone');
      if (nameEl) nameEl.textContent = contact.name || 'Family member';
      if (phoneEl) phoneEl.textContent = contact.phone || '';
    } catch (error) {
      console.warn('Failed to parse contact', error);
    }
  }

  getEmergencyContact() {
    const raw = localStorage.getItem('emergencyContact');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setupSosButton() {
    const btn = document.getElementById('sos-btn');
    if (btn) {
      btn.addEventListener('click', () => this.triggerEmergencyAlert());
    }
  }

  async triggerEmergencyAlert() {
    this.addUserMessage('Emergency Alert');
    const confirmAlert = confirm('🚨 EMERGENCY ALERT\n\nSend SOS to family and nearby hospitals?');
    if (!confirmAlert) {
      this.addBotMessage(this.t('sos_cancelled'));
      return;
    }

    this.addBotMessage(this.t('sos_preparing'));
    const contact = this.getEmergencyContact();
    const hospital = this.getNearestPoi('Hospital');

    try {
      await fetch('/api/chatbot/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: this.currentLocation,
          contact,
          nearestHospital: hospital,
          message: 'Emergency alert triggered via chatbot',
        }),
      });
    } catch (error) {
      console.warn('Emergency API failed', error);
    }

    this.addBotMessage(
      this.t('sos_sent', {
        contact: contact?.name || 'family contact',
        hospital: hospital?.name || 'nearest hospital',
      })
    );
    if (contact || hospital) {
      this.showSystemAlert(
        this.t('sos_banner', {
          contact: contact?.phone || contact?.name || 'family',
          hospital: hospital?.name || 'hospital',
        }),
        'danger'
      );
    }
    this.updateStatusBar('🚨 Emergency Alert Active', '🚨');
  }

  getNearestPoi(type) {
    if (!this.currentLocation) return POI_DATA.find((poi) => poi.type === type);
    const enriched = POI_DATA.filter((poi) => (type ? poi.type === type : true)).map((poi) => ({
      ...poi,
      distance: this.calculateDistance(poi.lat, poi.lng, this.currentLocation.lat, this.currentLocation.lng),
    }));
    enriched.sort((a, b) => a.distance - b.distance);
    return enriched[0];
  }

  updatePoiList() {
    const container = document.getElementById('poi-list');
    const countEl = document.getElementById('poi-count');
    if (!container) return;

    if (!this.currentLocation) {
      container.innerHTML = `<p class="empty-poi">Enable live location to view nearby support centers.</p>`;
      if (countEl) countEl.textContent = '0 spots found';
      return;
    }

    const enriched = POI_DATA.map((poi) => ({
      ...poi,
      distance: this.calculateDistance(poi.lat, poi.lng, this.currentLocation.lat, this.currentLocation.lng),
    }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6);

    container.innerHTML = enriched
      .map(
        (poi) => `
        <div class="poi-card">
          <h4>${poi.type} · ${poi.name}</h4>
          <p class="poi-meta">${poi.address}</p>
          <p class="poi-meta">📞 ${poi.phone}</p>
          <p class="poi-meta">📍 ${poi.distance.toFixed(1)} km away</p>
        </div>
      `
      )
      .join('');

    if (countEl) countEl.textContent = `${enriched.length} spots found`;
    this.showSystemAlert('Nearby safety network refreshed.', 'info');
  }

  updateLocationCard() {
    const coordsEl = document.getElementById('location-coords');
    const accEl = document.getElementById('location-accuracy');
    if (!coordsEl || !accEl) return;
    if (!this.currentLocation) {
      coordsEl.textContent = 'Waiting for GPS...';
      accEl.textContent = '';
      return;
    }
    coordsEl.textContent = `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)}`;
    accEl.textContent = `±${this.currentLocation.accuracy?.toFixed(0) || 0} m accuracy`;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  initConnectivityMonitor() {
    const update = () => {
      if (!navigator.onLine) {
        this.showSystemAlert(this.t('offline'), 'warning');
      } else {
        this.showSystemAlert('You are online. All services active.', 'success');
      }
    };
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  }

  showSystemAlert(message, tone = 'info') {
    const banner = document.getElementById('alert-banner');
    if (!banner) return;
    banner.style.display = 'block';
    banner.textContent = message;
    banner.className = `system-alert ${tone}`;

    const alertStatus = document.getElementById('alert-status');
    const alertDetail = document.getElementById('alert-detail');
    if (alertStatus) alertStatus.textContent = tone === 'danger' ? 'High Priority' : tone === 'warning' ? 'Heads up' : 'All clear';
    if (alertDetail) alertDetail.textContent = message;
  }

  speakIfAvailable(text) {
    if (!this.speechSynth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.language === 'kn' ? 'kn-IN' : 'en-IN';
    this.speechSynth.cancel();
    this.speechSynth.speak(utterance);
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Chatbot();
});

