// ── FIREBASE INIT ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let db;
let teacherLocations = {};
let isAdminLoggedIn = false;

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

// ── FETCH UPCOMING CALENDAR EVENTS ──
async function loadUpcomingEvents() {
  const container = document.getElementById('upcoming-events');
  if (!container) return;
  container.innerHTML = '<div class="events-loading">Loading upcoming events...</div>';
  try {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${CALENDAR_API_KEY}&timeMin=${encodeURIComponent(now)}&maxResults=4&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1.5rem 0;">No upcoming events scheduled.</p>';
      return;
    }
    container.innerHTML = data.items.map(event => {
      const start = event.start.dateTime || event.start.date;
      const date = new Date(start);
      const isAllDay = !event.start.dateTime;
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const timeStr = isAllDay ? 'All Day' : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const day = date.getDate();
      return `
        <div class="event-item">
          <div class="event-date-badge">
            <span class="event-month">${month}</span>
            <span class="event-day">${day}</span>
          </div>
          <div class="event-info">
            <div class="event-title">${event.summary || 'Untitled Event'}</div>
            <div class="event-meta">${dateStr} · ${timeStr}${event.location ? ' · ' + event.location : ''}</div>
            ${event.description ? `<div class="event-desc">${event.description}</div>` : ''}
          </div>
        </div>`;
    }).join('');
  } catch (e) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1.5rem 0;">Could not load events — make sure the calendar is set to public.</p>';
    console.warn('Calendar fetch error:', e);
  }
}

// ── LOAD LOCATIONS FROM FIRESTORE ──
async function loadLocations() {
  try {
    const snap = await getDoc(doc(db, "config", "teacherLocations"));
    if (snap.exists()) {
      teacherLocations = snap.data();
    } else {
      TEACHERS.forEach(t => { teacherLocations[t.id] = t.defaultLocation; });
    }
    renderTeachers();
  } catch (e) {
    TEACHERS.forEach(t => { teacherLocations[t.id] = t.defaultLocation; });
    renderTeachers();
  }
}

// ── SAVE LOCATIONS TO FIRESTORE ──
async function saveLocations(updates) {
  try {
    Object.assign(teacherLocations, updates);
    await setDoc(doc(db, "config", "teacherLocations"), teacherLocations);
    return true;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
}

// ── NAVIGATION ──
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  document.querySelector('.nav-links').classList.remove('open');
  window.scrollTo(0, 0);
}

// ── RENDER TEACHERS ──
function renderTeachers(filter = 'all') {
  const grid = document.getElementById('teachers-grid');
  if (!grid) return;
  const filtered = filter === 'all' ? TEACHERS : TEACHERS.filter(t =>
    t.subject.toLowerCase().includes(filter.toLowerCase()) ||
    (filter === 'coach' && (t.subject.toLowerCase().includes('coach') || t.subject.toLowerCase().includes('specialist')))
  );
  grid.innerHTML = filtered.map(t => {
    const loc = teacherLocations[t.id] || t.defaultLocation;
    return `
      <div class="teacher-card" id="tc-${t.id}">
        <div class="teacher-photo" id="photo-${t.id}">
          <div class="initials">${t.initials}</div>
        </div>
        <div class="teacher-body">
          <div class="teacher-name">${t.name}</div>
          <div class="teacher-subject">${t.subject}</div>
          <div class="teacher-location">
            <span class="dot"></span>
            <span id="loc-${t.id}">${loc}</span>
          </div>
          <div class="teacher-bio">${t.bio}</div>
          <div class="teacher-schedule">${t.schedule}</div>
        </div>
      </div>`;
  }).join('');
}

// ── RENDER INTERVIEWS ──
function renderInterviews() {
  const grid = document.getElementById('interviews-grid');
  if (!grid) return;
  const questions = [
    { q: "Skills Developed", key: "skills" },
    { q: "Biggest Win", key: "win" },
    { q: "Biggest Challenge", key: "challenge" },
    { q: "Who Would Thrive Here?", key: "recommend" }
  ];
  grid.innerHTML = INTERVIEWS.map(iv => `
    <div class="interview-card">
      <div class="interview-header">
        <div class="interview-avatar">${iv.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
        <div>
          <div class="interview-name">${iv.name}</div>
          <div class="interview-grade">${iv.grade}</div>
        </div>
      </div>
      ${questions.map(q => `
        <div class="qa-item">
          <div class="qa-q">${q.q}</div>
          <div class="qa-a">${iv[q.key]}</div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

// ── RENDER ADMIN PANEL ──
function renderAdminPanel() {
  const grid = document.getElementById('admin-grid');
  if (!grid) return;
  grid.innerHTML = TEACHERS.map(t => {
    const cur = teacherLocations[t.id] || t.defaultLocation;
    return `
      <div class="admin-teacher-card">
        <div class="admin-teacher-name">${t.name}</div>
        <select id="admin-loc-${t.id}">
          ${LOCATIONS.map(l => `<option value="${l}" ${l===cur?'selected':''}>${l}</option>`).join('')}
        </select>
        <div id="other-wrap-${t.id}" style="display:${cur==='Other'?'block':'none'}">
          <input type="text" id="admin-other-${t.id}" placeholder="Type location..."
            value="${!LOCATIONS.includes(cur) && cur !== 'Other' ? cur : ''}"
            style="width:100%;padding:0.5rem 0.8rem;border:1.5px solid #d0dbd3;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:0.88rem;margin-top:0.5rem;outline:none;background:var(--cream);">
        </div>
      </div>`;
  }).join('');
  TEACHERS.forEach(t => {
    const sel = document.getElementById(`admin-loc-${t.id}`);
    if (sel) sel.addEventListener('change', () => {
      const wrap = document.getElementById(`other-wrap-${t.id}`);
      if (wrap) wrap.style.display = sel.value === 'Other' ? 'block' : 'none';
    });
  });
}

// ── ADMIN LOGIN ──
function setupAdminLogin() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('admin-pw').value;
    const err = document.getElementById('admin-error');
    if (pw === ADMIN_PASSWORD) {
      isAdminLoggedIn = true;
      document.getElementById('admin-login-section').style.display = 'none';
      document.getElementById('admin-panel-section').style.display = 'block';
      renderAdminPanel();
    } else {
      if (err) { err.style.display = 'block'; err.textContent = 'Incorrect password. Please try again.'; }
    }
  });
}

// ── SAVE ALL LOCATIONS ──
window.saveAllLocations = async function() {
  const updates = {};
  TEACHERS.forEach(t => {
    const sel = document.getElementById(`admin-loc-${t.id}`);
    if (!sel) return;
    let val = sel.value;
    if (val === 'Other') {
      const inp = document.getElementById(`admin-other-${t.id}`);
      val = inp && inp.value.trim() ? inp.value.trim() : 'Other';
    }
    updates[t.id] = val;
  });
  const ok = await saveLocations(updates);
  const msg = document.getElementById('admin-save-msg');
  if (msg) {
    msg.style.display = 'block';
    msg.textContent = ok ? '✓ Locations saved successfully!' : '⚠ Saved locally (Firebase unavailable).';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);
  }
  renderTeachers();
};

// ── CONTACT FORM ──
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const other = document.getElementById('cf-other').value.trim();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      if (db) {
        await addDoc(collection(db, "contactSubmissions"), {
          name, email, other, timestamp: serverTimestamp()
        });
      }
      form.reset();
      const succ = document.getElementById('form-success');
      if (succ) succ.style.display = 'block';
      btn.textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => { if (succ) succ.style.display = 'none'; }, 4000);
    } catch (err) {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      alert('Submission failed. Please try again.');
    }
  });
}

// ── TEACHER FILTER TABS ──
function setupFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTeachers(tab.dataset.filter);
    });
  });
}

// ── HAMBURGER ──
function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  if (btn && links) btn.addEventListener('click', () => links.classList.toggle('open'));
}

// ── ADMIN LOGOUT ──
window.adminLogout = function() {
  isAdminLoggedIn = false;
  document.getElementById('admin-login-section').style.display = 'block';
  document.getElementById('admin-panel-section').style.display = 'none';
  document.getElementById('admin-pw').value = '';
};

window.navigate = navigate;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  renderInterviews();
  loadUpcomingEvents();
  setupAdminLogin();
  setupContactForm();
  setupFilterTabs();
  setupHamburger();
  navigate('home');
});
