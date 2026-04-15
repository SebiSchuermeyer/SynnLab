import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, CALENDAR_ID, CALENDAR_API_KEY, TEACHERS, INTERVIEWS, LOCATIONS, ADMIN_PASSWORD } from "./data.js";

let db;
let teacherLocations = {};
let isAdminLoggedIn = false;

// ── FIREBASE INIT ──
async function initFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    await loadLocations();
  } catch (e) {
    console.warn("Firebase init error:", e);
    TEACHERS.forEach(t => { teacherLocations[t.id] = t.defaultLocation; });
    renderTeachers();
  }
}

// ── NAVIGATION ──
window.navigate = function(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  
  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.classList.remove('open');
  window.scrollTo(0, 0);
};

// ── FETCH LOCATIONS ──
async function loadLocations() {
  try {
    const docRef = doc(db, "status", "teacherLocations");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      teacherLocations = docSnap.data();
    } else {
      TEACHERS.forEach(t => { teacherLocations[t.id] = t.defaultLocation; });
    }
  } catch (e) {
    TEACHERS.forEach(t => { teacherLocations[t.id] = t.defaultLocation; });
  }
  renderTeachers();
}

// ── RENDER TEACHERS ──
function renderTeachers(filter = 'All') {
  const grid = document.getElementById('teachers-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = TEACHERS.filter(t => filter === 'All' || t.subject === filter);

  filtered.forEach(t => {
    const loc = teacherLocations[t.id] || t.defaultLocation;
    const card = document.createElement('div');
    card.className = 'teacher-card';
    card.innerHTML = `
      <div class="teacher-header">
        <div class="teacher-avatar">${t.initials}</div>
        <div class="teacher-name-box">
          <h3>${t.name}</h3>
          <p>${t.subject}</p>
        </div>
      </div>
      <div class="status-badge">
        <span class="status-dot"></span>
        Currently: <strong>${loc}</strong>
      </div>
      <div class="teacher-info">
        <p><strong>Schedule:</strong> ${t.schedule}</p>
        <p>${t.bio}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── ADMIN LOGIC ──
function setupAdminLogin() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('admin-pw').value;
    if (pw === ADMIN_PASSWORD) {
      isAdminLoggedIn = true;
      document.getElementById('admin-login-section').style.display = 'none';
      document.getElementById('admin-panel-section').style.display = 'block';
      renderAdminPanel();
    } else {
      document.getElementById('admin-error').textContent = 'Incorrect password.';
    }
  });
}

function renderAdminPanel() {
  const container = document.getElementById('admin-grid');
  if (!container) return;
  container.innerHTML = '';

  TEACHERS.forEach(t => {
    const current = teacherLocations[t.id] || t.defaultLocation;
    const item = document.createElement('div');
    item.className = 'admin-teacher-item';
    
    let options = LOCATIONS.map(loc => `<option value="${loc}" ${current === loc ? 'selected' : ''}>${loc}</option>`).join('');
    
    item.innerHTML = `
      <label>${t.name}</label>
      <select id="admin-loc-${t.id}">${options}</select>
    ```;
    container.appendChild(item);
  });
}

window.saveAllLocations = async function() {
  const updates = {};
  TEACHERS.forEach(t => {
    updates[t.id] = document.getElementById(`admin-loc-${t.id}`).value;
  });
  
  try {
    await setDoc(doc(db, "status", "teacherLocations"), updates);
    teacherLocations = updates;
    const msg = document.getElementById('admin-save-msg');
    msg.textContent = "✓ Locations saved successfully!";
    renderTeachers();
    setTimeout(() => { msg.textContent = ""; }, 3000);
  } catch (e) {
    alert("Error saving: " + e.message);
  }
};

window.adminLogout = function() {
  isAdminLoggedIn = false;
  document.getElementById('admin-login-section').style.display = 'block';
  document.getElementById('admin-panel-section').style.display = 'none';
};

// ── CALENDAR ──
async function loadUpcomingEvents() {
  const container = document.getElementById('upcoming-events');
  if (!container) return;
  try {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${CALENDAR_API_KEY}&timeMin=${encodeURIComponent(now)}&maxResults=4&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      container.innerHTML = '<p>No upcoming events.</p>';
      return;
    }

    container.innerHTML = data.items.map(event => {
      const start = new Date(event.start.dateTime || event.start.date);
      return `
        <div class="event-item">
          <div class="event-date-badge">
            <span class="event-month">${start.toLocaleString('default', {month:'short'})}</span>
            <span class="event-day">${start.getDate()}</span>
          </div>
          <div class="event-info">
            <div class="event-title">${event.summary}</div>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    container.innerHTML = '<p>Unable to load calendar.</p>';
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  loadUpcomingEvents();
  setupAdminLogin();
  
  // Render Student Stories
  const storyGrid = document.getElementById('interviews-grid');
  if(storyGrid) {
    storyGrid.innerHTML = INTERVIEWS.map(i => `
      <div class="interview-card">
        <h3>${i.name} — ${i.grade}</h3>
        <p><strong>Major Win:</strong> ${i.win}</p>
        <p><strong>Challenge:</strong> ${i.challenge}</p>
        <p><strong>Advice:</strong> ${i.recommend}</p>
      </div>
    `).join('');
  }

  // Filter Tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTeachers(tab.dataset.filter);
    });
  });

  // Hamburger
  const ham = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  if(ham) ham.addEventListener('click', () => links.classList.toggle('open'));
});
