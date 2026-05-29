import { API_IP_ADDESS, API_PORT } from "./global.js";

let radiationChart, altitudeChart, correlationChart;
let sessionStartTime;
let radiationHistory = [];
let altitudeHistory = [];
let temperatureHistory = [];
let pressureHistory = [];
let lastRadiationRate = 0;
let lastAltitude = 0;
let lastTemperature = 0;

// Initialize charts
function initCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#999',
          font: { size: 12 }
        }
      },
      filler: {
        propagate: true
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#888', maxTicksLimit: 6 }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#888' }
      }
    }
  };

  // Radiation Chart
  const radiationCtx = document.getElementById('radiationChart').getContext('2d');
  radiationChart = new Chart(radiationCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Contagens/min',
        data: [],
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#4a90e2'
      }]
    },
    options: chartOptions
  });

  // Altitude Chart
  const altitudeCtx = document.getElementById('altitudeChart').getContext('2d');
  altitudeChart = new Chart(altitudeCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Altitude (m)',
        data: [],
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#4a90e2'
      }]
    },
    options: chartOptions
  });

  // Correlation Chart
  const correlationCtx = document.getElementById('correlationChart').getContext('2d');
  correlationChart = new Chart(correlationCtx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Temperatura vs Pressão',
        data: [],
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.3)',
        borderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#4a90e2'
      }]
    },
    options: {
      ...chartOptions,
      scales: {
        x: {
          ...chartOptions.scales.x,
          title: { display: true, text: 'Temperatura (°C)', color: '#888' }
        },
        y: {
          ...chartOptions.scales.y,
          title: { display: true, text: 'Pressão (Pa)', color: '#888' }
        }
      }
    }
  });
}

// Update charts with new data
function updateCharts(timestamp, radiationRate, altitude, temperature, pressure) {
  const timeLabel = new Date(timestamp).toLocaleTimeString('pt-PT');

  // Keep only last 100 points
  if (radiationChart.data.labels.length > 100) {
    radiationChart.data.labels.shift();
    radiationChart.data.datasets[0].data.shift();
    altitudeChart.data.labels.shift();
    altitudeChart.data.datasets[0].data.shift();
  }

  // Add new data
  radiationChart.data.labels.push(timeLabel);
  radiationChart.data.datasets[0].data.push(radiationRate);
  radiationChart.update('none');

  altitudeChart.data.labels.push(timeLabel);
  altitudeChart.data.datasets[0].data.push(altitude);
  altitudeChart.update('none');

  // Correlation chart (limit to last 50)
  if (correlationChart.data.datasets[0].data.length > 50) {
    correlationChart.data.datasets[0].data.shift();
  }
  correlationChart.data.datasets[0].data.push({
    x: temperature,
    y: pressure
  });
  correlationChart.update('none');

  radiationHistory.push(radiationRate);
  altitudeHistory.push(altitude);
  temperatureHistory.push(temperature);
  pressureHistory.push(pressure);
}

// Calculate trend
function calculateTrend(currentValue, previousValue) {
  if (!previousValue) return '→';
  if (currentValue > previousValue) return '↑';
  if (currentValue < previousValue) return '↓';
  return '→';
}

// Update UI with new data
function updateDashboard(data) {
  // Update metrics
  document.getElementById('radiationRate').textContent = Math.round(data.activityCountsPerMin || 0);
  document.getElementById('altitude').textContent = Math.round(data.altitudeM || 0);
  document.getElementById('temperature').textContent = (data.temperatureC || 0).toFixed(1);
  document.getElementById('pressure').textContent = Math.round(data.pressurePa || 0);
  document.getElementById('acceleration').textContent = (data.accelerationMs2 || 0).toFixed(2);
  document.getElementById('signalQuality').textContent = '100%'; // Update based on actual signal
  document.getElementById('magneticField').textContent = (data.magneticFieldUT || 0).toFixed(2);

  // Update trends
  const radiationTrend = calculateTrend(data.activityCountsPerMin, lastRadiationRate);
  const altitudeTrend = calculateTrend(data.altitudeM, lastAltitude);
  const tempTrend = calculateTrend(data.temperatureC, lastTemperature);

  document.getElementById('radiationTrend').textContent = radiationTrend + (radiationTrend === '↑' ? ' Aumentando' : radiationTrend === '↓' ? ' Diminuindo' : ' Estável');
  document.getElementById('altitudeTrend').textContent = altitudeTrend + (altitudeTrend === '↑' ? ' Ascensão' : altitudeTrend === '↓' ? ' Descida' : ' Estável');
  document.getElementById('tempTrend').textContent = tempTrend + ' Normal';

  // Update peak radiation
  const peakRad = Math.max(...radiationHistory, data.activityCountsPerMin || 0);
  document.getElementById('peakRadiation').textContent = Math.round(peakRad);

  // Update data points
  document.getElementById('dataPoints').textContent = radiationHistory.length;

  // Update charts
  updateCharts(new Date().toISOString(), data.activityCountsPerMin || 0, data.altitudeM || 0, data.temperatureC || 0, data.pressurePa || 0);

  lastRadiationRate = data.activityCountsPerMin || 0;
  lastAltitude = data.altitudeM || 0;
  lastTemperature = data.temperatureC || 0;
}

// Update session info
function updateSessionInfo(sessionData) {
  if (sessionData) {
    document.getElementById('sessionName').textContent = sessionData.sessionName || '---';
    document.getElementById('sessionId').textContent = sessionData.sessionId || '---';
    if (sessionData.sessionStart) {
      sessionStartTime = new Date(sessionData.sessionStart);
      document.getElementById('sessionStart').textContent = sessionStartTime.toLocaleString('pt-PT');
    }
  }
}

// Update session duration
function updateSessionDuration() {
  if (sessionStartTime) {
    const now = new Date();
    const duration = new Date(now - sessionStartTime);
    const hours = duration.getUTCHours();
    const minutes = duration.getUTCMinutes();
    const seconds = duration.getUTCSeconds();
    document.getElementById('sessionDuration').textContent = 
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

// Handle system status
function updateSystemStatus(isConnected) {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  
  if (isConnected) {
    statusDot.style.background = '#00ff00';
    statusDot.style.boxShadow = '0 0 10px rgba(0,255,0,0.5)';
    statusText.textContent = 'CONECTADO';
    statusText.style.color = '#00ff00';
  } else {
    statusDot.style.background = '#ff4444';
    statusDot.style.boxShadow = '0 0 10px rgba(255,68,68,0.5)';
    statusText.textContent = 'DESCONECTADO';
    statusText.style.color = '#ff4444';
  }
}

// Initialize SignalR connection
function initSignalR() {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`http://${API_IP_ADDESS}:${API_PORT}/telemetryHub`)
    .withAutomaticReconnect()
    .build();

  connection.on('ReceiveTelemetry', (data) => {
    console.log('Telemetry received:', data);
    updateDashboard(data);
  });

  connection.on('SessionUpdate', (sessionData) => {
    console.log('Session updated:', sessionData);
    updateSessionInfo(sessionData);
  });

  connection.on('ConnectionStatus', (status) => {
    console.log('Connection status:', status);
    updateSystemStatus(status.isConnected);
  });

  connection.onreconnecting((error) => {
    console.log('Reconnecting...', error);
    updateSystemStatus(false);
  });

  connection.onreconnected((connectionId) => {
    console.log('Reconnected!', connectionId);
    updateSystemStatus(true);
  });

  connection.start()
    .then(() => {
      console.log('SignalR connected');
      updateSystemStatus(true);
    })
    .catch((error) => {
      console.error('SignalR connection error:', error);
      updateSystemStatus(false);
      setTimeout(() => initSignalR(), 5000); // Retry after 5 seconds
    });

  return connection;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initSignalR();
  
  // Update session duration every second
  setInterval(updateSessionDuration, 1000);

  // Initialize with demo data (remove in production)
  // Uncomment to test without backend
  /*
  updateSessionInfo({
    sessionName: 'Voo Teste #1',
    sessionId: 'SESS_001',
    sessionStart: new Date()
  });
  
  let demoCounter = 0;
  setInterval(() => {
    demoCounter++;
    updateDashboard({
      activityCountsPerMin: 120 + Math.random() * 50,
      altitudeM: 5000 + demoCounter * 10,
      temperatureC: -20 + Math.random() * 5,
      pressurePa: 50000 - demoCounter * 10,
      accelerationMs2: 0.5 + Math.random() * 0.2,
      magneticFieldUT: 45 + Math.random() * 5
    });
  }, 1000);
  */
});

// Check if SignalR is loaded, if not, load it
if (typeof signalR === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@microsoft/signalr@latest/signalr.min.js';
  script.onload = () => {
    console.log('SignalR library loaded');
  };
  document.head.appendChild(script);
}