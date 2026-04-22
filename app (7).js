// ── FIREBASE INIT ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Import data
import { 
  firebaseConfig, 
  CALENDAR_ID, 
  CALENDAR_API_KEY, 
  CALENDAR_FULL_URL,
  TEACHERS, 
  INTERVIEWS, 
  LOCATIONS, 
  ADMIN_PASSWORD 
} from './data.js';

// ── GOOGLE DRIVE GALLERY CONFIG ──
const DRIVE_FOLDER_ID = "1tnPSjZXQ9w_f2Lp2RBrSmzttfUrNi8K7";
const DRIVE_API_KEY   = "AIzaSyD9Bout20qQD8k4Yk9RoN40t9-JkeXZuZc";

let db;
let teacherLocations = {};
let isAdminLoggedIn = false;

// Make these available globally
window.CALENDAR_FULL_URL = CALENDAR_FULL_URL;
window.TEACHERS = TEACHERS;

async function initFirebase() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
    await loadLocations();
  } catch (e) {
    console.warn("Firebase init error:", e);
    // Fallback to default locations
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
    
    console.log('Fetching calendar events...');
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Calendar data received:', data);
    
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
            ${event.description ? `<div class="event-desc">${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</div>` : ''}
          </div>
        </div>`;
    }).join('');
  } catch (e) {
    console.error('Calendar fetch error:', e);
    container.innerHTML = `
      <div style="color:var(--text-muted);text-align:center;padding:1.5rem 0;">
        <p>Unable to load calendar events.</p>
        <p style="font-size:0.85rem;margin-top:0.5rem;">
          <a href="${CALENDAR_FULL_URL}" target="_blank" style="color:var(--green);text-decoration:underline;">
            View calendar directly →
          </a>
        </p>
      </div>
    `;
  }
}

// ── GOOGLE DRIVE PHOTO GALLERY ──
async function loadGallery() {
  const container = document.querySelector('.gallery-placeholder');
  if (!container) return;

  container.innerHTML = '<div class="events-loading" style="text-align:center;padding:2rem;">Loading photos...</div>';

  try {
    // Query the Drive API for image files inside the folder
    const query = encodeURIComponent(`'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`);
    const fields = encodeURIComponent('files(id,name,mimeType,thumbnailLink,webContentLink)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${DRIVE_API_KEY}&fields=${fields}&pageSize=50`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Drive API error: ${res.status}`);

    const data = await res.json();
    const files = data.files || [];

    if (files.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--text-muted);">
          <div style="font-size:3rem;">📸</div>
          <p style="font-weight:600;color:var(--green);margin-top:0.5rem;">No photos yet</p>
          <p>Add images to the connected Google Drive folder and they'll appear here automatically.</p>
        </div>`;
      return;
    }

    // Build a lightbox-ready grid
    container.innerHTML = `
      <div class="gallery-grid" style="
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
        gap:1rem;">
        ${files.map((f, i) => {
          // thumbnailLink is a small preview; swap s220 → s800 for a bigger thumbnail
          const thumb = f.thumbnailLink
            ? f.thumbnailLink.replace(/=s\d+$/, '=s800')
            : `https://drive.google.com/thumbnail?id=${f.id}&sz=w800`;
          const full  = `https://drive.google.com/file/d/${f.id}/view`;
          return `
            <a href="${full}" target="_blank" rel="noopener"
               style="display:block;border-radius:12px;overflow:hidden;
                      box-shadow:0 2px 8px rgba(0,0,0,0.10);
                      transition:transform 0.2s,box-shadow 0.2s;"
               onmouseover="this.style.transform='scale(1.03)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.18)'"
               onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.10)'">
              <img src="${thumb}" alt="${f.name}"
                   loading="lazy"
                   style="width:100%;height:200px;object-fit:cover;display:block;" />
            </a>`;
        }).join('')}
      </div>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-top:1.25rem;text-align:center;">
        ${files.length} photo${files.length !== 1 ? 's' : ''} · Updates automatically when new images are added to the folder
      </p>`;

  } catch (e) {
    console.error('Gallery load error:', e);
    container.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text-muted);">
        <div style="font-size:3rem;">📸</div>
        <p style="font-weight:600;color:var(--green);margin-top:0.5rem;">Unable to load photos</p>
        <p style="font-size:0.875rem;">Make sure the Drive folder is shared as "Anyone with the link can view".</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;color:#999;">Error: ${e.message}</p>
      </div>`;
  }
}

// ── LOAD LOCATIONS FROM FIRESTORE ──
async function loadLocations() {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    
    const docRef = doc(db, "config", "teacherLocations");
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      const data = snap.data();
      teacherLocations = data;
      console.log('Loaded locations from Firestore:', teacherLocations);
    } else {
      console.log('No locations found, using defaults');
      TEACHERS.forEach(t => { teacherLocations[t.id] = t.defaultLocation; });
      // Create the document with defaults
      await setDoc(docRef, teacherLocations);
    }
    renderTeachers();
  } catch (e) {
    console.warn('Error loading locations:', e);
    TEACHERS.forEach(t => { teacherLocations[t.id] = t.defaultLocation; });
    renderTeachers();
  }
}

// ── SAVE LOCATIONS TO FIRESTORE ──
async function saveLocations(updates) {
  try {
    Object.assign(teacherLocations, updates);
    
    if (db) {
      const docRef = doc(db, "config", "teacherLocations");
      await setDoc(docRef, teacherLocations);
      console.log('Saved locations to Firestore:', teacherLocations);
      return true;
    } else {
      console.warn('Firestore not available, saved locally only');
      return false;
    }
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
}

// ── NAVIGATION ──
function navigate(pageId) {
  console.log('Navigating to:', pageId);
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  
  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  
  document.querySelector('.nav-links')?.classList.remove('open');
  window.scrollTo(0, 0);
  
  // Refresh content when navigating to specific pages
  if (pageId === 'teachers') {
    renderTeachers();
  } else if (pageId === 'interviews') {
    renderInterviews();
  } else if (pageId === 'gallery') {
    loadGallery();
  } else if (pageId === 'admin' && isAdminLoggedIn) {
    renderAdminPanel();
  }
}

// ── RENDER TEACHERS ──
function renderTeachers(filter = 'all') {
  const grid = document.getElementById('teachers-grid');
  if (!grid) return;
  
  const filtered = filter === 'all' ? TEACHERS : TEACHERS.filter(t => {
    if (filter === 'coach') {
      return t.subject.toLowerCase().includes('coach') || t.subject.toLowerCase().includes('specialist');
    }
    return t.subject.toLowerCase().includes(filter.toLowerCase());
  });
  
  grid.innerHTML = filtered.map(t => {
    const loc = teacherLocations[t.id] || t.defaultLocation;
    return `
      <div class="teacher-card" id="tc-${t.id}">
        <div class="teacher-photo" id="photo-${t.id}">
          ${t.photo
            ? `<img src="${t.photo}" alt="${t.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="initials" style="display:none;">${t.initials}</div>`
            : `<div class="initials">${t.initials}</div>`
          }
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
    const isOther = !LOCATIONS.slice(0, -1).includes(cur);
    return `
      <div class="admin-teacher-card">
        <div class="admin-teacher-name">${t.name}</div>
        <select id="admin-loc-${t.id}" class="location-select">
          ${LOCATIONS.map(l => `<option value="${l}" ${l===cur||(l==='Other'&&isOther)?'selected':''}>${l}</option>`).join('')}
        </select>
        <div id="other-wrap-${t.id}" style="display:${isOther?'block':'none'}">
          <input type="text" id="admin-other-${t.id}" placeholder="Type location..."
            value="${isOther ? cur : ''}"
            style="width:100%;padding:0.5rem 0.8rem;border:1.5px solid #d0dbd3;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:0.88rem;margin-top:0.5rem;outline:none;background:var(--cream);">
        </div>
      </div>`;
  }).join('');
  
  // Add event listeners to selects
  TEACHERS.forEach(t => {
    const sel = document.getElementById(`admin-loc-${t.id}`);
    if (sel) {
      sel.addEventListener('change', () => {
        const wrap = document.getElementById(`other-wrap-${t.id}`);
        if (wrap) {
          wrap.style.display = sel.value === 'Other' ? 'block' : 'none';
        }
      });
    }
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
      if (err) err.style.display = 'none';
    } else {
      if (err) { 
        err.style.display = 'block'; 
        err.textContent = 'Incorrect password. Please try again.'; 
      }
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
    msg.textContent = ok ? '✓ Locations saved successfully!' : '✓ Saved locally (Firebase unavailable).';
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
    
    if (!name || !email) {
      alert('Please fill in your name and email.');
      return;
    }
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    try {
      if (db) {
        await addDoc(collection(db, "contactSubmissions"), {
          name, 
          email, 
          message: other,
          timestamp: serverTimestamp()
        });
        console.log('Contact form submitted successfully');
      } else {
        console.log('Contact submission (Firebase unavailable):', { name, email, other });
      }
      
      form.reset();
      const succ = document.getElementById('form-success');
      if (succ) {
        succ.style.display = 'block';
        setTimeout(() => { succ.style.display = 'none'; }, 4000);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      alert('Submission failed. Please try again or contact us directly.');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
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

// ── HAMBURGER MENU ──
function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }
  
  // Close menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });
}

// ── ADMIN LOGOUT ──
window.adminLogout = function() {
  isAdminLoggedIn = false;
  document.getElementById('admin-login-section').style.display = 'block';
  document.getElementById('admin-panel-section').style.display = 'none';
  const pwField = document.getElementById('admin-pw');
  if (pwField) pwField.value = '';
};

// ── EXPOSE FUNCTIONS GLOBALLY ──
window.navigate = navigate;

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing app...');
  
  await initFirebase();
  renderInterviews();
  await loadUpcomingEvents();
  setupAdminLogin();
  setupContactForm();
  setupFilterTabs();
  setupHamburger();
  
  // Start on home page
  navigate('home');
  
  console.log('App initialization complete');
});
