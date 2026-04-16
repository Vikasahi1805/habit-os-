/**
 * HabitOS — Firebase Database Configuration
 * File: js/firebase.js
 *
 * ══════════════════════════════════════════════════════
 * SETUP INSTRUCTIONS (5 minutes):
 *
 * 1. Go to https://console.firebase.google.com
 * 2. Create project → Add Web App → copy firebaseConfig
 * 3. Paste your real values below (replace all "YOUR_..." strings)
 * 4. Firebase Console → Authentication → Google → Enable
 * 5. Firebase Console → Firestore Database → Create (test mode)
 * 6. Deploy — done!
 *
 * Full guide: docs/FIREBASE_SETUP.md
 * ══════════════════════════════════════════════════════
 */

import { initializeApp }                                          from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
                                                                  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, onSnapshot }
                                                                  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── PASTE YOUR FIREBASE CONFIG HERE ──────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA60neKh1jDfNPHLK3LK8xykuNs5h-dSy8",
  authDomain: "habitos-vik.firebaseapp.com",
  projectId: "habitos-vik",
  storageBucket: "habitos-vik.firebasestorage.app",
  messagingSenderId: "706521042975",
  appId: "1:706521042975:web:45effdef231590dc8fc52a",
  measurementId: "G-HE79V1RTFF"
};
// ─────────────────────────────────────────────────────

let app, auth, db;
let currentUser       = null;
let unsubscribeSnap   = null;
let firebaseReady     = false;
let firebaseInitError = null;

/* ── INITIALISE ── */
try {
  // Always attempt init; if your config is still a template/invalid, Firebase
  // will throw and we’ll show the error in the UI.
  app           = initializeApp(firebaseConfig);
  auth          = getAuth(app);
  db            = getFirestore(app);
  firebaseReady = true;
} catch (e) {
  firebaseReady     = false;
  firebaseInitError = e;
  console.warn('[HabitOS] Firebase init failed:', e);
}

/* ── AUTH STATE LISTENER ── */
if (firebaseReady) {
  onAuthStateChanged(auth, async user => {
    currentUser = user;
    if (user) {
      window.__firebaseUser = user;
      showApp();
      updateUserUI(user);
      await loadFromFirestore(user.uid);
      subscribeToFirestore(user.uid);
    } else {
      window.__firebaseUser = null;
      updateSettingsAuthUI(null);
      showAuth();
      stopFirestoreSubscription();
    }
  });
} else {
  // No Firebase configured — show app in guest mode
  showApp();
  showLocalBanner();
}

/* ── SIGN IN / SIGN OUT ── */
window.signInWithGoogle = async () => {
  if (!firebaseReady) { showLocalBanner(); return; }
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (e) {
    console.error('[HabitOS] Sign-in error:', e);
  }
};

window.signOutUser = async () => {
  if (!firebaseReady) return;
  stopFirestoreSubscription();
  await signOut(auth);
};

/* ── USER UI ── */
function updateUserUI(user) {
  const el = document.getElementById('userArea');
  if (!el) return;
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px">
      <img src="${user.photoURL || ''}"
           style="width:28px;height:28px;border-radius:50%;border:1px solid var(--border)"
           onerror="this.style.display='none'">
      <span style="font-size:0.78rem;color:var(--text2);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
        ${user.displayName || user.email}
      </span>
      <button onclick="signOutUser()"
        style="background:transparent;border:1px solid var(--border);color:var(--text2);padding:4px 10px;border-radius:6px;cursor:pointer;font-family:'Space Mono',monospace;font-size:0.65rem;transition:all 0.2s"
        onmouseover="this.style.borderColor='var(--danger)';this.style.color='var(--danger)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">
        Sign out
      </button>
      <span id="syncIndicator"
        style="font-family:'Space Mono',monospace;font-size:0.6rem;color:var(--accent)">
        ☁ synced
      </span>
    </div>`;

  updateSettingsAuthUI(user);
}

function updateSettingsAuthUI(user) {
  const nameEl = document.getElementById('settingsName');
  const emailEl = document.getElementById('settingsEmail');
  const avatarEl = document.getElementById('settingsAvatar');
  const authBtn = document.getElementById('settingsAuthBtn');
  if (!nameEl || !emailEl || !avatarEl) return;

  if (!user) {
    avatarEl.textContent = '?';
    nameEl.textContent = 'Guest User';
    emailEl.textContent = 'Not signed in';
    if (authBtn) {
      authBtn.textContent = '☁ Sign in with Google';
      authBtn.onclick = () => window.signInWithGoogle();
    }
    return;
  }

  const name = (user.displayName || '').trim();
  const email = (user.email || '').trim();

  avatarEl.textContent = getInitials(name || email);
  nameEl.textContent = name || email || 'User';
  emailEl.textContent = email || '';

  if (authBtn) {
    authBtn.textContent = 'Sign out';
    authBtn.onclick = () => window.signOutUser();
  }
}

function getInitials(nameOrEmail) {
  const v = (nameOrEmail || '').trim();
  if (!v) return '?';
  if (v.includes('@')) return v.split('@')[0].slice(0, 2).toUpperCase();

  const parts = v.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function showLocalBanner() {
  const el = document.getElementById('userArea');
  if (!el) return;
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-family:'Space Mono',monospace;font-size:0.65rem;color:var(--text2)">
        💾 Local only
      </span>
      ${firebaseReady
        ? `<button onclick="signInWithGoogle()"
             style="background:var(--accent);color:#0a0e1a;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-family:'Syne',sans-serif;font-weight:700;font-size:0.72rem">
             Sign in to sync ☁
           </button>`
        : `<span style="font-family:'Space Mono',monospace;font-size:0.6rem;color:var(--text2)">
             ${firebaseInitError ? '(Firebase init failed)' : '(Firebase not configured)'}
           </span>`}
    </div>`;
}

/* ── FIRESTORE SAVE ── */
window._saveToFirestore = async (uid, data) => {
  if (!db || !uid) return;
  try {
    setSyncIndicator('saving...');
    await setDoc(
      doc(db, 'users', uid),
      { state: JSON.stringify(data) },
      { merge: true }
    );
    setSyncIndicator('☁ synced');
  } catch (e) {
    setSyncIndicator('⚠ error');
    console.error('[HabitOS] Firestore save error:', e);
  }
};

/* ── FIRESTORE LOAD (one-time on login) ── */
async function loadFromFirestore(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists() && snap.data().state) {
      window._applyRemoteState(JSON.parse(snap.data().state));
    }
  } catch (e) {
    console.error('[HabitOS] Firestore load error:', e);
  }
}

/* ── FIRESTORE REAL-TIME SUBSCRIPTION ── */
function subscribeToFirestore(uid) {
  unsubscribeSnap = onSnapshot(doc(db, 'users', uid), snap => {
    if (snap.exists() && snap.data().state) {
      window._applyRemoteState(JSON.parse(snap.data().state));
    }
  });
}

function stopFirestoreSubscription() {
  if (unsubscribeSnap) { unsubscribeSnap(); unsubscribeSnap = null; }
}

/* ── HELPERS ── */
function setSyncIndicator(msg) {
  const el = document.getElementById('syncIndicator');
  if (el) el.textContent = msg;
}

function showApp() {
  document.getElementById('authScreen').style.display  = 'none';
  document.getElementById('appWrapper').style.display  = 'block';
}

function showAuth() {
  document.getElementById('authScreen').style.display  = 'flex';
  document.getElementById('appWrapper').style.display  = 'none';
}
