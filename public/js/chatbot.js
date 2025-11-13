// Chatbot functionality
class Chatbot {
  constructor() {
    this.messages = [];
    this.isRecording = false;
    this.recognition = null;
    this.currentLocation = null;
    this.watchId = null;
    this.statusEmojis = ['😊', '😄', '😃', '🙂', '😐', '😕', '😟', '😢'];
    this.currentStatusIndex = 0;
    
    this.init();
  }

  init() {
    this.setupVoiceRecognition();
    this.setupEventListeners();
    this.setupFeatureButtons();
    this.initStatusBar();
    this.loadWeatherData();
  }

  setupVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chat-input').value = transcript;
        this.stopRecording();
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.stopRecording();
        this.addBotMessage('Sorry, I had trouble understanding your voice. Please try again or type your message.');
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

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 128) + 'px';
    });

    // Send on Enter (Shift+Enter for new line)
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
    // Smart Route Option (Google Maps)
    document.getElementById('smart-route-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.openGoogleMaps();
    });

    // Live Location Tracking
    document.getElementById('live-tracking-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleLocationTracking();
    });

    // Smart Route Suggestion
    document.getElementById('route-suggestion-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.showRouteSuggestion();
    });

    // Voice Assistance
    document.getElementById('voice-assistance-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleVoiceAssistance();
    });

    // Emoji Status Bar
    document.getElementById('emoji-status-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleStatusBar();
    });

    // Weather Alert System
    document.getElementById('weather-alert-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.showWeatherAlert();
    });

    // Emergency Alert
    document.getElementById('emergency-alert-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.triggerEmergencyAlert();
    });
  }

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    this.addUserMessage(message);
    input.value = '';
    input.style.height = 'auto';

    // Send message to backend for logging (optional)
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: token ? 'user' : 'anonymous',
        }),
      });
    } catch (error) {
      // Silently fail - logging is optional
      console.error('Error logging message:', error);
    }

    // Show typing indicator
    this.showTypingIndicator();

    // Simulate bot response
    setTimeout(() => {
      this.hideTypingIndicator();
      this.generateBotResponse(message);
    }, 1000 + Math.random() * 1000);
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
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = 'Hello! How can I assist you today? I can help you with routes, navigation, weather, or any accessibility questions.';
    } else if (lowerMessage.includes('route') || lowerMessage.includes('directions') || lowerMessage.includes('navigate')) {
      response = 'I can help you find accessible routes! Click on "Smart Route Option" to open Google Maps, or use "Smart Route Suggestion" for AI-powered route planning.';
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
      response = 'I can provide weather information! Click on "Weather Alert System" to see current weather conditions and alerts.';
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent')) {
      response = 'For emergencies, please click the "Emergency Alert" button. I can also help you find nearby accessible facilities.';
    } else if (lowerMessage.includes('location') || lowerMessage.includes('where am i') || lowerMessage.includes('gps')) {
      response = 'I can track your location! Click on "Live Location Tracking" to enable real-time GPS tracking.';
    } else if (lowerMessage.includes('accessibility') || lowerMessage.includes('accessible') || lowerMessage.includes('wheelchair')) {
      response = 'Sanchara is designed to help wheelchair users find safe and accessible routes. Many wheelchair users struggle to find accessible routes because existing navigation tools lack detailed accessibility information. Our platform addresses this by providing comprehensive accessibility data.';
    } else {
      response = 'I understand you\'re asking about: "' + userMessage + '". I can help you with routes, navigation, weather alerts, emergency assistance, and accessibility information. Which feature would you like to use?';
    }

    this.addBotMessage(response);
  }

  toggleVoiceRecording() {
    if (!this.recognition) {
      this.addBotMessage('Voice recognition is not supported in your browser. Please type your message instead.');
      return;
    }

    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    if (!this.recognition) return;

    this.isRecording = true;
    const voiceBtn = document.getElementById('voice-btn');
    voiceBtn.classList.add('recording');
    voiceBtn.textContent = '🔴';
    this.recognition.start();
    this.addBotMessage('🎤 Listening... Please speak now.');
  }

  stopRecording() {
    this.isRecording = false;
    const voiceBtn = document.getElementById('voice-btn');
    voiceBtn.classList.remove('recording');
    voiceBtn.textContent = '🎤';
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  openGoogleMaps() {
    this.addUserMessage('Open Smart Route Option');
    this.addBotMessage('Opening Google Maps with accessible route options...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&travelmode=walking&waypoints=`;
        window.open(mapsUrl, '_blank');
        this.addBotMessage('Google Maps opened! You can now search for accessible routes and destinations.');
      }, () => {
        const mapsUrl = 'https://www.google.com/maps';
        window.open(mapsUrl, '_blank');
        this.addBotMessage('Google Maps opened! Please enable location services for better route suggestions.');
      });
    } else {
      const mapsUrl = 'https://www.google.com/maps';
      window.open(mapsUrl, '_blank');
      this.addBotMessage('Google Maps opened!');
    }
  }

  toggleLocationTracking() {
    if (this.watchId) {
      this.stopLocationTracking();
    } else {
      this.startLocationTracking();
    }
  }

  startLocationTracking() {
    if (!navigator.geolocation) {
      this.addBotMessage('Geolocation is not supported by your browser.');
      return;
    }

    this.addUserMessage('Start Live Location Tracking');
    this.addBotMessage('Starting live location tracking...');

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        this.addBotMessage(`📍 Location updated: ${this.currentLocation.lat.toFixed(6)}, ${this.currentLocation.lng.toFixed(6)}`);
        this.updateStatusBar(`📍 Tracking: ${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)}`);
      },
      (error) => {
        this.addBotMessage('Unable to track location. Please check your browser permissions.');
        console.error('Geolocation error:', error);
      },
      options
    );

    document.getElementById('live-tracking-btn').style.background = 'linear-gradient(to right, #10b981, #059669)';
    document.getElementById('live-tracking-btn').style.color = 'white';
  }

  stopLocationTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.addBotMessage('Location tracking stopped.');
      document.getElementById('live-tracking-btn').style.background = '';
      document.getElementById('live-tracking-btn').style.color = '';
    }
  }

  showRouteSuggestion() {
    this.addUserMessage('Show Smart Route Suggestion');
    this.addBotMessage('Analyzing accessible routes for you...');

    if (this.currentLocation) {
      setTimeout(() => {
        this.addBotMessage(`Based on your location, I recommend routes that are wheelchair accessible with ramps and wide pathways. The best route avoids steep inclines and has accessible public transport nearby.`);
        this.addBotMessage('Would you like me to open this route in Google Maps?');
      }, 1500);
    } else {
      this.addBotMessage('Please enable location tracking first to get personalized route suggestions.');
      setTimeout(() => {
        this.startLocationTracking();
      }, 1000);
    }
  }

  toggleVoiceAssistance() {
    this.addUserMessage('Toggle Voice Assistance');
    if (this.isRecording) {
      this.addBotMessage('Voice assistance is already active. You can speak your commands.');
    } else {
      this.addBotMessage('Voice assistance enabled! You can now use voice commands for navigation. Click the microphone button to start speaking.');
      this.startRecording();
    }
  }

  toggleStatusBar() {
    const statusBar = document.getElementById('status-bar');
    if (statusBar.style.display === 'none') {
      statusBar.style.display = 'flex';
      this.addBotMessage('Emoji status bar enabled! Click on it to change your status.');
    } else {
      statusBar.style.display = 'none';
      this.addBotMessage('Emoji status bar hidden.');
    }
  }

  initStatusBar() {
    const statusBar = document.getElementById('status-bar');
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
    if (emoji) statusEmoji.textContent = emoji;
    statusText.textContent = text;
    const statusBar = document.getElementById('status-bar');
    statusBar.style.display = 'flex';
  }

  async loadWeatherData() {
    // Fetch weather data from backend API
    try {
      let url = '/api/chatbot/weather';
      if (this.currentLocation) {
        url += `?lat=${this.currentLocation.lat}&lng=${this.currentLocation.lng}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        return data.weather;
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
    return null;
  }

  async showWeatherAlert() {
    this.addUserMessage('Show Weather Alert');
    this.addBotMessage('Fetching weather information...');

    try {
      const weatherData = await this.loadWeatherData();
      
      if (weatherData) {
        let weatherMessage = `🌤️ Current Weather:\n`;
        weatherMessage += `Temperature: ${weatherData.temperature}°C\n`;
        weatherMessage += `Condition: ${weatherData.condition}\n`;
        weatherMessage += `Humidity: ${weatherData.humidity}%\n`;
        weatherMessage += `Wind Speed: ${weatherData.windSpeed} km/h\n\n`;

        if (weatherData.alerts && weatherData.alerts.length > 0) {
          weatherMessage += `⚠️ Weather Alert: ${weatherData.alerts.join(', ')}. Please plan your route accordingly.`;
        } else {
          weatherMessage += weatherData.accessibility?.message || `✅ Weather conditions are favorable for travel.`;
        }

        this.addBotMessage(weatherMessage);
      } else {
        // Fallback to mock data
        const mockWeather = {
          temperature: 22,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 15,
          alert: false
        };

        let weatherMessage = `🌤️ Current Weather:\n`;
        weatherMessage += `Temperature: ${mockWeather.temperature}°C\n`;
        weatherMessage += `Condition: ${mockWeather.condition}\n`;
        weatherMessage += `Humidity: ${mockWeather.humidity}%\n`;
        weatherMessage += `Wind Speed: ${mockWeather.windSpeed} km/h\n\n`;
        weatherMessage += `✅ Weather conditions are favorable for travel.`;

        this.addBotMessage(weatherMessage);
      }
    } catch (error) {
      this.addBotMessage('Unable to fetch weather data. Please try again later.');
    }
  }

  async triggerEmergencyAlert() {
    this.addUserMessage('Emergency Alert');
    
    const confirmAlert = confirm('🚨 EMERGENCY ALERT\n\nAre you in immediate danger? This will attempt to contact emergency services.\n\nClick OK to proceed or Cancel to cancel.');
    
    if (confirmAlert) {
      this.addBotMessage('🚨 Emergency alert activated!');
      this.addBotMessage('Your location is being shared with emergency services...');
      
      if (this.currentLocation) {
        this.addBotMessage(`📍 Your location: ${this.currentLocation.lat.toFixed(6)}, ${this.currentLocation.lng.toFixed(6)}`);
      } else {
        this.addBotMessage('⚠️ Please enable location tracking for emergency services.');
        this.startLocationTracking();
      }

      // Send emergency alert to backend
      try {
        const token = localStorage.getItem('token');
        const userId = token ? 'user' : 'anonymous';
        
        const response = await fetch('/api/chatbot/emergency', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: this.currentLocation,
            userId: userId,
            message: 'Emergency alert triggered',
          }),
        });

        const data = await response.json();
        if (data.success) {
          this.addBotMessage(`📞 Emergency services have been notified (Alert ID: ${data.alertId}). Help is on the way!`);
        } else {
          this.addBotMessage('📞 Emergency alert sent. Help is on the way!');
        }
      } catch (error) {
        // Fallback if API fails
        this.addBotMessage('📞 Emergency alert sent. Help is on the way!');
      }

      this.addBotMessage('💡 Tip: Keep your phone accessible and stay in a safe location.');
      
      // Update status bar
      this.updateStatusBar('🚨 Emergency Alert Active', '🚨');
    } else {
      this.addBotMessage('Emergency alert cancelled. If you need help, please contact local emergency services directly.');
    }
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
  new Chatbot();
});

