const API_BASE_URL = "http://127.0.0.1:8000/api";
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchHistory();
});

// Navigation Logic
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.add('hidden'));

  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.classList.remove('hidden');
  }
}

// Open Form Planner
function selectPlanner(type) {
  const formsContainer = document.getElementById('plannerForms');
  const forms = document.querySelectorAll('.planner-form');
  
  formsContainer.classList.remove('hidden');
  forms.forEach(form => form.classList.add('hidden'));
  document.getElementById('recommendationOutput').classList.add('hidden');

  if (type === 'homeDecor') document.getElementById('homeDecorForm').classList.remove('hidden');
  if (type === 'party') document.getElementById('partyForm').classList.remove('hidden');
  if (type === 'jewelry') document.getElementById('jewelryForm').classList.remove('hidden');

  formsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Modal Handlers
function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

// User Authentication
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  currentUser = { name: email.split('@')[0], email: email };
  updateAuthUI();
  closeModal('loginModal');
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  currentUser = { name: name };
  updateAuthUI();
  closeModal('registerModal');
}

function handleLogout() {
  currentUser = null;
  updateAuthUI();
}

function updateAuthUI() {
  const authContainer = document.getElementById('authContainer');
  const userProfileContainer = document.getElementById('userProfileContainer');
  const userNameDisplay = document.getElementById('userNameDisplay');

  if (currentUser) {
    authContainer.classList.add('hidden');
    userProfileContainer.classList.remove('hidden');
    userNameDisplay.textContent = currentUser.name;
  } else {
    authContainer.classList.remove('hidden');
    userProfileContainer.classList.add('hidden');
  }
}

// API Submission Handlers
async function handleHomeDecorSubmit(e) {
  e.preventDefault();
  const payload = {
    budget: parseFloat(document.getElementById('homeBudget').value),
    lights: parseInt(document.getElementById('numLights').value) || 0,
    fans: parseInt(document.getElementById('numFans').value) || 0,
    furniture: parseInt(document.getElementById('numFurniture').value) || 0,
    notes: document.getElementById('homeNotes').value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/plan/home`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    renderOutput(data);
    fetchHistory();
  } catch (err) {
    alert("Error connecting to backend API.");
  }
}

async function handlePartySubmit(e) {
  e.preventDefault();
  const payload = {
    event_type: document.getElementById('eventType').value,
    budget: parseFloat(document.getElementById('partyBudget').value),
    guest_count: parseInt(document.getElementById('guestCount').value),
    notes: document.getElementById('partyNotes').value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/plan/party`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    renderOutput(data);
    fetchHistory();
  } catch (err) {
    alert("Error connecting to backend API.");
  }
}

async function handleJewelrySubmit(e) {
  e.preventDefault();
  const payload = {
    budget: parseFloat(document.getElementById('jewelryBudget').value),
    notes: document.getElementById('jewelryNotes').value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/plan/jewelry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    renderOutput(data);
    fetchHistory();
  } catch (err) {
    alert("Error connecting to backend API.");
  }
}

// Render Results
function renderOutput(data) {
  const outputBox = document.getElementById('recommendationOutput');
  const outputContent = document.getElementById('outputContent');

  let listItems = data.breakdown.map(item => 
    `<li><span>${item.category}:</span> <strong>₹${item.amount.toLocaleString()}</strong></li>`
  ).join('');

  outputContent.innerHTML = `
    <h4>${data.title}</h4>
    <p><strong>Total Budget:</strong> ₹${data.total_budget.toLocaleString()}</p>
    <ul class="breakdown-list">${listItems}</ul>
    ${data.suggestion ? `<p class="suggestion-text">* ${data.suggestion}</p>` : ''}
  `;

  outputBox.classList.remove('hidden');
  outputBox.scrollIntoView({ behavior: 'smooth' });
}

// History Fetching
async function fetchHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/history`);
    const historyData = await res.json();
    const historyList = document.getElementById('historyList');

    if (!historyData || historyData.length === 0) {
      historyList.innerHTML = '<p>No previous searches recorded yet.</p>';
      return;
    }

    historyList.innerHTML = historyData.map(item => `
      <div class="history-card">
        <h4><i class="fa-solid fa-clock-rotate-left"></i> ${item.type}</h4>
        <p><strong>Budget:</strong> ₹${item.amount.toLocaleString()}</p>
        <small style="color: #64748b;">Saved on ${item.date}</small>
      </div>
    `).join('');
  } catch (err) {
    console.log("Unable to load history from backend.");
  }
}
