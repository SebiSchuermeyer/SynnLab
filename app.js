import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── CONFIGURATIONS ──
const firebaseConfig = {
  apiKey: "AIzaSyBL01CF4uoFyNOcuvld7sUvCmkxq2PZpJY",
  authDomain: "synn-lab-website.firebaseapp.com",
  projectId: "synn-lab-website",
  storageBucket: "synn-lab-website.firebasestorage.app",
  messagingSenderId: "13702226348",
  appId: "1:13702226348:web:07e85688b017e6d301da09",
  measurementId: "G-MSYNH78VTL"
};

const CAL_ID = "c_11826ce2a0863e61725e61ca90ed7560418d88d94590c691bc935c0a415794d0@group.calendar.google.com";
const CAL_KEY = "AIzaSyCetKTh3b94ojpvivdWyeM2BS0bYJXhfW8";

let db;
let teacherLocations = {};

// ── INITIALIZATION ──
async function initApp() {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    await loadLocations();
    renderInterviews();
    loadCalendar();
    setupAdminLogin();
    setupContactForm();
    navigate('home');
  } catch (err) {
    console.error("App startup failed:", err);
  }
}

// ── NAVIGATION ──
function navigate(pageId) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(pageId + '-page');
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-links a').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });
  
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.classList.remove('open');
}

// ── FIREBASE ACTIONS ──
async function loadLocations() {
  const docRef = doc(db, "config", "teacherLocations");
  const snap = await getDoc(docRef);
  if (snap.exists()) teacherLocations = snap.data();
  renderTeachers();
}

async function saveAllLocations() {
  const btn = document.querySelector('.btn-save-all');
  btn.textContent = 'Saving...';
  try {
    const selects = document.querySelectorAll('.location-select');
    selects.forEach(sel => {
      teacherLocations[sel.dataset.tid] = sel.value;
    });
    await setDoc(doc(db, "config", "teacherLocations"), teacherLocations);
    renderTeachers();
    alert("Live locations updated!");
  } catch (e) {
    alert("Error saving to Firebase: " + e.message);
  } finally {
    btn.textContent = 'Save All Locations';
  }
}

// ── RENDERING ──
function renderTeachers() {
  const grid = document.getElementById('teachers-grid');
  const adminGrid = document.getElementById('admin-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (adminGrid) adminGrid.innerHTML = '';

  TEACHERS.forEach(t => {
    const loc = teacherLocations[t.id] || "Unknown";
    
    // Public Grid
    grid.innerHTML += `
      <div class="teacher-card">
        <div class="teacher-header">
          <div class="teacher-avatar">${t.initials}</div>
          <div><h3>${t.name}</h3><p>${t.subject}</p></div>
        </div>
        <div class="location-badge">Currently in: <strong>${loc}</strong></div>
        <p style="margin-top:1rem; font-size:0.9rem;">${t.bio}</p>
      </div>`;
    
    // Admin Grid
    if (adminGrid) {
      adminGrid.innerHTML += `
        <div class="admin-item">
          <span>${t.name}</span>
          <select class="location-select" data-tid="${t.id}">
            ${LOCATIONS.map(l => `<option value="${l}" ${l===loc?'selected':''}>${l}</option>`).join('')}
          </select>
        </div>`;
    }
  });
}

function renderInterviews() {
  const container = document.getElementById('interviews-grid');
  if (!container) return;
  container.innerHTML = INTERVIEWS.map(i => `
    <div class="interview-card">
      <h3>${i.name} (${i.grade})</h3>
      <p><strong>Win:</strong> ${i.win}</p>
      <p><strong>Advice:</strong> ${i.recommend}</p>
    </div>
  `).join('');
}

// ── CALENDAR & FORMS ──
async function loadCalendar() {
  const container = document.getElementById('upcoming-events');
  if (!container) return;
  try {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events?key=${CAL_KEY}&timeMin=${encodeURIComponent(now)}&maxResults=4&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.items) {
      container.innerHTML = data.items.map(e => `<div class="event-item"><strong>${e.summary}</strong></div>`).join('');
    }
  } catch (e) { console.error("Calendar fail", e); }
}

function setupAdminLogin() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  form.onsubmit = (e) => {
    e.preventDefault();
    if (document.getElementById('admin-pw').value === ADMIN_PASSWORD) {
      document.getElementById('admin-login-section').style.display = 'none';
      document.getElementById('admin-panel-section').style.display = 'block';
    } else {
      alert("Invalid Password");
    }
  };
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.onsubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contactSubmissions"), {
        name: document.getElementById('c-name').value,
        timestamp: serverTimestamp()
      });
      alert("Message Sent!");
      form.reset();
    } catch (err) { alert("Error sending message."); }
  };
}

// ── EXPOSE TO BUTTONS ──
window.navigate = navigate;
window.saveAllLocations = saveAllLocations;
window.adminLogout = () => {
  document.getElementById('admin-login-section').style.display = 'block';
  document.getElementById('admin-panel-section').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', initApp);
