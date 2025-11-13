const form = document.getElementById('predict-form');
const urlInput = document.getElementById('url-input');
const submitBtn = document.getElementById('submit-btn');
const statusBox = document.getElementById('status');
const outputBox = document.getElementById('output');
const outUrl = document.getElementById('out-url');
const outPred = document.getElementById('out-pred');
const prismContainer = document.getElementById('prism-container');

function showStatus(message, type = 'info') {
  statusBox.hidden = false;
  statusBox.className = `card ${type}`;
  statusBox.textContent = message;
}

function clearStatus() {
  statusBox.hidden = true;
  statusBox.textContent = '';
  statusBox.className = 'card';
}

function showResult(url, prediction) {
  outputBox.hidden = false;
  outUrl.textContent = url;
  outPred.innerHTML = '';
  const span = document.createElement('span');
  span.className = `pill ${prediction === 'phishing' ? 'phish' : 'legit'}`;
  span.textContent = prediction.toUpperCase();
  outPred.appendChild(span);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearStatus();
  outputBox.hidden = true;
  const url = urlInput.value.trim();
  if (!url) return;
  submitBtn.disabled = true;
  showStatus('Checking URL...', 'info');
  try {
    const res = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    clearStatus();
    showResult(data.url, data.prediction);
  } catch (err) {
    showStatus(err.message || 'Something went wrong', 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

// Initialize prism animation
if (window.createPrism && prismContainer) {
  window.__destroyPrism = window.createPrism(prismContainer, {
    animationType: 'rotate',
    timeScale: 0.5,
    height: 3.5,
    baseWidth: 5.5,
    scale: 3.6,
    hueShift: 0,
    colorFrequency: 1,
    noise: 0.5,
    glow: 1
  });
}


