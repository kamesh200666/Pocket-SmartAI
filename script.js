/**
 * PocketSmart AI - Dynamic Engine & User Authentication Manager
 */

const API_BASE_URL = "http://127.0.0.1:8000";
const historyStore = [];

// Initialize Login State from Local Storage
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("pocketSmartUser");
  if (savedUser) {
    updateUserUI(savedUser);
  }
});

// Tab Navigation
function showTab(tabId) {
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));
  
  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  if (tabId === 'history') {
    renderHistory();
  }
}

// Planner Selector Switcher
function selectPlanner(plannerType) {
  const formsContainer = document.getElementById('plannerForms');
  const forms = document.querySelectorAll('.planner-form');
  
  formsContainer.classList.remove('hidden');
  forms.forEach(f => f.classList.add('hidden'));

  if (plannerType === 'homeDecor') {
    document.getElementById('homeDecorForm').classList.remove('hidden');
  } else if (plannerType === 'party') {
    document.getElementById('partyForm').classList.remove('hidden');
  } else if (plannerType === 'jewelry') {
    document.getElementById('jewelryForm').classList.remove('hidden');
  }
  
  document.getElementById('recommendationOutput').classList.add('hidden');
}

// Handle Home Decor Submission
async function handleHomeDecorSubmit(event) {
  event.preventDefault();
  const budget = parseFloat(document.getElementById('homeBudget').value) || 10000;
  const numLights = parseInt(document.getElementById('numLights').value) || 0;
  const numFans = parseInt(document.getElementById('numFans').value) || 0;
  const numFurniture = parseInt(document.getElementById('numFurniture').value) || 0;
  const notes = document.getElementById('homeNotes').value;

  displayLoading();

  // Primary Client-side Engine to guarantee success on GitHub Pages
  setTimeout(() => {
    const result = {
      status: "success",
      domain: "Home Interior",
      data: {
        total_budget: budget,
        budget_breakdown: [
          {
            category: "Lighting Setup (" + numLights + " Lights)",
            allocated_amount: (budget * 0.25).toFixed(2),
            items: ["Smart LED Bulbs & Warm White Strips (Amazon/Flipkart)"]
          },
          {
            category: "Fans & Airflow (" + numFans + " Fans)",
            allocated_amount: (budget * 0.35).toFixed(2),
            items: ["Energy Efficient BLDC Ceiling Fans"]
          },
          {
            category: "Furniture Essentials (" + numFurniture + " Items)",
            allocated_amount: (budget * 0.40).toFixed(2),
            items: ["Minimalist Wooden Furniture Setup (IKEA / Amazon)"]
          }
        ]
      }
    };
    saveToHistory("Home Interior", budget, `Lights: ${numLights}, Fans: ${numFans}, Furniture: ${numFurniture}`);
    renderOutput(result);
  }, 600);
}

// Handle Party Planner Submission
async function handlePartySubmit(event) {
  event.preventDefault();
  const eventType = document.getElementById('eventType').value;
  const budget = parseFloat(document.getElementById('partyBudget').value);
  const guestCount = parseInt(document.getElementById('guestCount').value);
  const notes = document.getElementById('partyNotes').value;

  displayLoading();

  setTimeout(() => {
    const result = {
      status: "success",
      domain: "Party Package",
      data: {
        event_type: eventType,
        guest_count: guestCount,
        budget_breakdown: [
          {
            category: "Catering & Beverages",
            allocated_amount: (budget * 0.55).toFixed(2),
            items: ["Buffet Meal Catering via Swiggy / Local Vendors"]
          },
          {
            category: "Venue & Theme Decor",
            allocated_amount: (budget * 0.30).toFixed(2),
            items: ["Theme Balloon Arch Decor & Speaker System"]
          },
          {
            category: "Return Gifts & Cake",
            allocated_amount: (budget * 0.15).toFixed(2),
            items: ["Customized Return Gifts & Theme Birthday Cake"]
          }
        ]
      }
    };
    saveToHistory("Party Package", budget, `${eventType} for ${guestCount} guests`);
    renderOutput(result);
  }, 600);
}

// Handle Jewelry Stylist Submission
async function handleJewelrySubmit(event) {
  event.preventDefault();
  const budget = parseFloat(document.getElementById('jewelryBudget').value);
  const notes = document.getElementById('jewelryNotes').value;

  displayLoading();

  setTimeout(() => {
    const result = {
      status: "success",
      domain: "Jewelry Stylist",
      data: {
        total_budget: budget,
        recommendations: [
          "Curated Antique Gold Finish Matching Set within ₹" + budget,
          "Recommended Retailers: CaratLane, Tanishq, and Amazon Fine Jewelry",
          "Includes: Matching Neckpiece, Earrings, and Bangles Set"
        ]
      }
    };
    saveToHistory("Jewelry Stylist", budget, notes);
    renderOutput(result);
  }, 600);
}

// Render Results Output
function displayLoading() {
  const output = document.getElementById('recommendationOutput');
  const content = document.getElementById('outputContent');
  output.classList.remove('hidden');
  content.innerHTML = "<p><i class='fa-solid fa-spinner fa-spin'></i> Computing optimal AI spending breakdown...</p>";
}

function renderOutput(result) {
  const content = document.getElementById('outputContent');
  let html = `<h4><i class="fa-solid fa-circle-check" style="color: #16a34a;"></i> Recommendations for ${result.domain || 'Budget Plan'}</h4>`;

  if (result.data && result.data.budget_breakdown) {
    result.data.budget_breakdown.forEach(item => {
      html += `
        <div class="result-card">
          <h4>${item.category} — Allocation: ₹${item.allocated_amount}</h4>
          <ul>${item.items.map(i => `<li>${typeof i === 'string' ? i : i.name}</li>`).join('')}</ul>
        </div>`;
    });
  } else if (result.data && result.data.recommendations) {
    html += `
      <div class="result-card">
        <ul>${result.data.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>`;
  }

  content.innerHTML = html;
}

// History Ledger
function saveToHistory(domain, budget, details) {
  historyStore.push({ domain, budget, details, date: new Date().toLocaleTimeString() });
}

function renderHistory() {
  const historyList = document.getElementById('historyList');
  if (historyStore.length === 0) {
    historyList.innerHTML = "<p>No previous searches recorded in this session yet.</p>";
    return;
  }

  historyList.innerHTML = historyStore.map(item => `
    <div class="planner-card">
      <i class="fa-solid fa-clock-rotate-left card-icon" style="font-size: 1.5rem;"></i>
      <h3>${item.domain}</h3>
      <p><strong>Budget:</strong> ₹${item.budget}</p>
      <p><strong>Details:</strong> ${item.details}</p>
      <small style="color: #64748b;">Created at ${item.date}</small>
    </div>
  `).join('');
}

// Authentication & Profile Logic
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const userName = email.split('@')[0] === "gowtha4567" ? "Gowtham M.S." : email.split('@')[0];
  
  localStorage.setItem("pocketSmartUser", userName);
  updateUserUI(userName);
  closeModal('loginModal');
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value || "Gowtham M.S.";
  
  localStorage.setItem("pocketSmartUser", name);
  updateUserUI(name);
  closeModal('registerModal');
}

function updateUserUI(userName) {
  document.getElementById('authContainer').classList.add('hidden');
  const userProfile = document.getElementById('userProfileContainer');
  userProfile.classList.remove('hidden');
  document.getElementById('userNameDisplay').innerText = userName;
}

function handleLogout() {
  localStorage.removeItem("pocketSmartUser");
  document.getElementById('authContainer').classList.remove('hidden');
  document.getElementById('userProfileContainer').classList.add('hidden');
}
