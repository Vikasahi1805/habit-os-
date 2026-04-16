/**
 * HabitOS — Main Application Logic
 * File: js/app.js
 *
 * Sections:
 *  1. Constants & Data
 *  2. State Management
 *  3. Date Utilities
 *  4. XP & Leveling
 *  5. Celebrations & Confetti
 *  6. Reminders & Notifications
 *  7. Tracker — Stats & Grid
 *  8. Today View
 *  9. Heatmap
 * 10. Smart Insights
 * 11. Weekly Review
 * 12. Dashboard Charts
 * 13. Month Navigation
 * 14. Tab Switching
 * 15. Modals (Add Habit, Templates)
 * 16. Drag & Drop
 * 17. Settings
 * 18. Data Export / Import
 * 19. Keyboard Shortcuts
 * 20. Initialisation
 */

'use strict';

// ══════════════════════════════════════════════
// 1. CONSTANTS & DATA
// ══════════════════════════════════════════════

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CAT_COLORS = {
  Health:       { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
  Productivity: { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6' },
  Mindfulness:  { bg: 'rgba(139,92,246,0.15)',  color: '#8b5cf6' },
  Finance:      { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  Other:        { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
};

const TEMPLATES = {
  'Morning Routine': {
    icon: '🌅',
    habits: [
      { emoji: '🌅', name: 'Wake up at 6AM',        goal: 30, category: 'Health'      },
      { emoji: '🚫', name: 'No Snoozing',            goal: 30, category: 'Health'      },
      { emoji: '🚿', name: 'Cold Shower',            goal: 30, category: 'Health'      },
      { emoji: '💧', name: 'Drink Water (Morning)',  goal: 30, category: 'Health'      },
      { emoji: '📔', name: 'Morning Journal',        goal: 30, category: 'Mindfulness' },
    ],
  },
  'Fitness Routine': {
    icon: '💪',
    habits: [
      { emoji: '💪', name: 'Gym Workout',   goal: 20, category: 'Health' },
      { emoji: '🧘', name: 'Stretching',    goal: 30, category: 'Health' },
      { emoji: '🥗', name: 'Eat Clean',     goal: 30, category: 'Health' },
      { emoji: '💧', name: 'Drink 3L Water',goal: 30, category: 'Health' },
      { emoji: '😴', name: '8 Hours Sleep', goal: 30, category: 'Health' },
    ],
  },
  'Productivity System': {
    icon: '⚡',
    habits: [
      { emoji: '📖', name: 'Read 10 Pages',    goal: 30, category: 'Productivity' },
      { emoji: '🎓', name: 'Study 1 Hour',     goal: 25, category: 'Productivity' },
      { emoji: '📵', name: 'No Social Media',  goal: 30, category: 'Productivity' },
      { emoji: '✅', name: 'Daily To-Do List', goal: 30, category: 'Productivity' },
      { emoji: '💻', name: 'Deep Work Block',  goal: 22, category: 'Productivity' },
    ],
  },
  'Mindfulness Routine': {
    icon: '🧘',
    habits: [
      { emoji: '🧠', name: 'Meditation',         goal: 30, category: 'Mindfulness' },
      { emoji: '🙏', name: 'Gratitude Journal',  goal: 30, category: 'Mindfulness' },
      { emoji: '🌿', name: 'Nature Walk',        goal: 20, category: 'Mindfulness' },
      { emoji: '📵', name: 'Phone-Free Hour',    goal: 30, category: 'Mindfulness' },
      { emoji: '😮‍💨', name: 'Breathing Exercise', goal: 30, category: 'Mindfulness' },
    ],
  },
};

const STREAK_MILESTONES = [7, 30, 60, 100];

const QUOTES = [
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',              author: 'Aristotle'       },
  { text: 'Motivation is what gets you started. Habit is what keeps you going.',                       author: 'Jim Ryun'        },
  { text: 'Small daily improvements over time lead to stunning results.',                              author: 'Robin Sharma'    },
  { text: 'The secret of your future is hidden in your daily routine.',                                author: 'Mike Murdock'    },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.',        author: 'James Clear'     },
  { text: 'Success is the sum of small efforts repeated day in and day out.',                          author: 'Robert Collier'  },
  { text: 'A year from now you may wish you had started today.',                                       author: 'Karen Lamb'      },
  { text: "Don't watch the clock; do what it does. Keep going.",                                       author: 'Sam Levenson'    },
  { text: "It always seems impossible until it's done.",                                               author: 'Nelson Mandela'  },
  { text: 'The only bad workout is the one that did not happen.',                                      author: 'Unknown'         },
  { text: 'Your habits will determine your future.',                                                   author: 'Jack Canfield'   },
  { text: 'First forget inspiration. Habit is more dependable.',                                       author: 'Octavia Butler'  },
];

const THEMES = {
  default: { accent: '#00e5b0', accent2: '#3b82f6' },
  purple:  { accent: '#a78bfa', accent2: '#ec4899' },
  orange:  { accent: '#f97316', accent2: '#f59e0b' },
  red:     { accent: '#ef4444', accent2: '#f97316' },
  ice:     { accent: '#38bdf8', accent2: '#818cf8' },
  gold:    { accent: '#fbbf24', accent2: '#d97706' },
};

// ══════════════════════════════════════════════
// 2. STATE MANAGEMENT
// ══════════════════════════════════════════════

const STATE_KEY    = 'habitosState3';
const SETTINGS_KEY = 'habitosSettings';

let state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null') || {
  habits: [
    { id: 1,  emoji: '🌅', name: 'Wake up at 6AM',    goal: 30, category: 'Health',       reminder: '' },
    { id: 2,  emoji: '🚫', name: 'No Snoozing',        goal: 30, category: 'Health',       reminder: '' },
    { id: 3,  emoji: '💧', name: 'Drink 3L Water',     goal: 30, category: 'Health',       reminder: '' },
    { id: 4,  emoji: '💪', name: 'Gym Workout',        goal: 20, category: 'Health',       reminder: '' },
    { id: 5,  emoji: '🧘', name: 'Stretching',         goal: 30, category: 'Health',       reminder: '' },
    { id: 6,  emoji: '📖', name: 'Read 10 Pages',      goal: 30, category: 'Productivity', reminder: '' },
    { id: 7,  emoji: '🧠', name: 'Meditation',         goal: 30, category: 'Mindfulness',  reminder: '' },
    { id: 8,  emoji: '🎓', name: 'Study 1 Hour',       goal: 25, category: 'Productivity', reminder: '' },
    { id: 9,  emoji: '✨', name: 'Skincare Routine',   goal: 30, category: 'Health',       reminder: '' },
    { id: 10, emoji: '📵', name: 'Limit Social Media', goal: 30, category: 'Productivity', reminder: '' },
    { id: 11, emoji: '🚭', name: 'No Alcohol',         goal: 30, category: 'Health',       reminder: '' },
    { id: 12, emoji: '💰', name: 'Track Expenses',     goal: 30, category: 'Finance',      reminder: '' },
    { id: 13, emoji: '🚿', name: 'Cold Shower',        goal: 20, category: 'Health',       reminder: '' },
  ],
  completions:    {},
  viewYear:       new Date().getFullYear(),
  viewMonth:      new Date().getMonth(),
  xp:             0,
  seenMilestones: {},
};

let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null') || {
  colorMode:       'dark',
  theme:           'default',
  accentColor:     '#00e5b0',
  compactMode:     false,
  showGridLines:   true,
  fontSize:        'normal',
  weekStart:       0,
  defaultGoal:     30,
  showStreaks:     true,
  showCatBadges:   true,
  allowFuture:     false,
  showQuote:       true,
  showCelebrations:true,
  soundEnabled:    false,
  xpEnabled:       true,
  xpPerHabit:      10,
};

/** Persist state to localStorage + optionally sync to Firestore */
let _saveTimeout = null;
function save(pushToCloud = true) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  if (pushToCloud && window._saveToFirestore && window.__firebaseUser) {
    clearTimeout(_saveTimeout);
    _saveTimeout = setTimeout(
      () => window._saveToFirestore(window.__firebaseUser.uid, state),
      1000
    );
  }
}

/** Persist a single setting */
function saveSetting(key, val) {
  settings[key] = val;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/** Called by firebase.js when Firestore data arrives */
window._applyRemoteState = (remote) => {
  if (!remote) return;
  state = { ...state, ...remote };
  save(false);
  renderAll();
  const activeTab = document.querySelector('.tab.active')?.textContent.trim();
  if (activeTab === 'DASHBOARD') renderDashboard();
  if (activeTab === 'TODAY')     renderToday();
};

/** Guest mode (no Firebase) */
window.continueAsGuest = () => {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('appWrapper').style.display = 'block';
  const el = document.getElementById('userArea');
  if (el) el.innerHTML = `<span style="font-family:'Space Mono',monospace;font-size:0.65rem;color:var(--text2)">💾 Guest mode</span>`;
};

// ══════════════════════════════════════════════
// 3. DATE UTILITIES
// ══════════════════════════════════════════════

const daysInMonth  = (y, m) => new Date(y, m + 1, 0).getDate();
const dateKey      = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const todayKey     = () => { const t = new Date(); return dateKey(t.getFullYear(), t.getMonth(), t.getDate()); };
const isComplete   = (hid, key) => (state.completions[key] || []).includes(hid);

function toggle(hid, key) {
  if (!state.completions[key]) state.completions[key] = [];
  const idx    = state.completions[key].indexOf(hid);
  const xpAmt  = settings.xpEnabled ? (settings.xpPerHabit || 10) : 0;
  if (idx > -1) {
    state.completions[key].splice(idx, 1);
    state.xp = Math.max(0, (state.xp || 0) - xpAmt);
  } else {
    state.completions[key].push(hid);
    state.xp = (state.xp || 0) + xpAmt;
  }
  save();
}

function getMonthCompletions(y, m) {
  const days = daysInMonth(y, m), result = {};
  state.habits.forEach(h => (result[h.id] = 0));
  for (let d = 1; d <= days; d++) {
    const k = dateKey(y, m, d);
    (state.completions[k] || []).forEach(id => { if (result[id] !== undefined) result[id]++; });
  }
  return result;
}

function getDailyTotals(y, m) {
  return Array.from(
    { length: daysInMonth(y, m) },
    (_, i) => (state.completions[dateKey(y, m, i + 1)] || []).length
  );
}

function getStreak(hid) {
  let s = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    if ((state.completions[k] || []).includes(hid)) s++;
    else break;
  }
  return s;
}

// ══════════════════════════════════════════════
// 4. XP & LEVELING
// ══════════════════════════════════════════════

function renderXP() {
  const xp       = state.xp || 0;
  const level    = Math.floor(xp / 100) + 1;
  const xpInLvl  = xp % 100;
  document.getElementById('levelBadge').textContent       = `LVL ${level}`;
  document.getElementById('xpFill').style.width           = `${xpInLvl}%`;
  document.getElementById('xpLabel').textContent          = `${xpInLvl} / 100 XP`;
}

// ══════════════════════════════════════════════
// 5. CELEBRATIONS & CONFETTI
// ══════════════════════════════════════════════

function checkMilestones() {
  if (!settings.showCelebrations) return;
  state.habits.forEach(h => {
    const streak = getStreak(h.id);
    STREAK_MILESTONES.forEach(m => {
      const key = `${h.id}_${m}`;
      if (streak >= m && !state.seenMilestones[key]) {
        state.seenMilestones[key] = true;
        save();
        showCelebration(h, m);
      }
    });
  });
}

function showCelebration(habit, days) {
  const msgs = {
    7:   { emoji: '🔥', title: '7 Day Streak!',   sub: `${habit.emoji} ${habit.name} — You're building momentum!` },
    30:  { emoji: '🏆', title: '30 Day Streak!',  sub: `${habit.emoji} ${habit.name} — You're unstoppable!`      },
    60:  { emoji: '💎', title: '60 Day Streak!',  sub: `${habit.emoji} ${habit.name} — You're a habit machine!`  },
    100: { emoji: '🌟', title: '100 Day Streak!', sub: `${habit.emoji} ${habit.name} — LEGENDARY!`               },
  };
  const msg = msgs[days];
  document.getElementById('celebEmoji').textContent  = msg.emoji;
  document.getElementById('celebTitle').textContent  = msg.title;
  document.getElementById('celebSub').textContent    = msg.sub;
  document.getElementById('celebrationOverlay').classList.add('show');
  launchConfetti();
}

function closeCelebration() {
  document.getElementById('celebrationOverlay').classList.remove('show');
  stopConfetti();
}

let confettiAnim  = null;
const CCOLORS     = ['#00e5b0', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function launchConfetti() {
  const canvas  = document.getElementById('confettiCanvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx     = canvas.getContext('2d');
  const parts   = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width, y: -20,
    size: Math.random() * 8 + 4,
    color: CCOLORS[Math.floor(Math.random() * CCOLORS.length)],
    vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3 + 2,
    rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 6,
    alpha: 1,
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
      if (p.y > canvas.height * 0.7) p.alpha -= 0.02;
      if (p.alpha > 0) alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (alive) confettiAnim = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

function stopConfetti() {
  if (confettiAnim) cancelAnimationFrame(confettiAnim);
  const c = document.getElementById('confettiCanvas');
  c.getContext('2d').clearRect(0, 0, c.width, c.height);
}

// ══════════════════════════════════════════════
// 6. REMINDERS & NOTIFICATIONS
// ══════════════════════════════════════════════

function requestNotifPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function checkReminders() {
  const now     = new Date();
  const nowTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const todayK  = todayKey();
  state.habits.forEach(h => {
    if (!h.reminder || h.reminder !== nowTime || isComplete(h.id, todayK)) return;
    fireReminder(h);
  });
}

function fireReminder(habit) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('⏰ HabitOS', { body: `Time to: ${habit.emoji} ${habit.name}` });
  } else {
    showToast(`⏰ ${habit.emoji} ${habit.name}`, "It's time for your habit!");
  }
}

function showToast(title, body) {
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastBody').textContent  = body;
  const t = document.getElementById('reminderToast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 8000);
}

function dismissToast() {
  document.getElementById('reminderToast').classList.remove('show');
}

setInterval(checkReminders, 60000);
requestNotifPermission();

// ══════════════════════════════════════════════
// 7. TRACKER — STATS & GRID
// ══════════════════════════════════════════════

function renderStats() {
  const { viewYear: y, viewMonth: m } = state;
  const today    = new Date();
  const isCM     = y === today.getFullYear() && m === today.getMonth();
  const doneUpTo = isCM ? today.getDate() : daysInMonth(y, m);
  const totals   = getDailyTotals(y, m);
  const totalDone    = totals.slice(0, doneUpTo).reduce((a, b) => a + b, 0);
  const maxPossible  = state.habits.length * doneUpTo;
  const pct          = maxPossible > 0 ? Math.round(totalDone / maxPossible * 100) : 0;
  let streak         = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    if ((state.completions[k] || []).length > 0) streak++;
    else break;
  }
  const bestDay = Math.max(...totals, 0);
  const level   = Math.floor((state.xp || 0) / 100) + 1;
  document.getElementById('statsRow').innerHTML = `
    <div class="stat-card" style="animation-delay:0s">
      <div class="label">Completion Rate</div><div class="value">${pct}%</div>
      <div class="sub">${totalDone} of ${maxPossible} habits</div>
    </div>
    <div class="stat-card" style="animation-delay:0.05s">
      <div class="label">Active Streak</div><div class="value" style="color:var(--accent3)">${streak}</div>
      <div class="sub">consecutive days</div>
    </div>
    <div class="stat-card" style="animation-delay:0.1s">
      <div class="label">Best Day</div><div class="value" style="color:var(--accent2)">${bestDay}</div>
      <div class="sub">habits in one day</div>
    </div>
    <div class="stat-card" style="animation-delay:0.15s">
      <div class="label">Total XP</div><div class="value" style="color:#f59e0b">${state.xp || 0}</div>
      <div class="sub">Level ${level} Explorer</div>
    </div>`;
}

function renderGrid() {
  const { viewYear: y, viewMonth: m } = state;
  const days      = daysInMonth(y, m);
  const today     = new Date();
  const isCM      = y === today.getFullYear() && m === today.getMonth();
  const todayDate = today.getDate();
  const catFilter = document.getElementById('catFilter')?.value || '';

  // Build week columns
  const weeks = [];
  let week    = [];
  const firstDay = new Date(y, m, 1).getDay();
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (let d = 1; d <= days; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) weeks.push(week);

  const monthCounts = getMonthCompletions(y, m);
  const filtered    = catFilter
    ? state.habits.filter(h => h.category === catFilter)
    : state.habits;

  // Build table HTML
  let html = '<thead><tr>';
  html += `<th class="habit-name-col" style="position:sticky;left:0;z-index:3;background:var(--surface2)">HABIT</th>
           <th class="goal-col">GOAL</th>`;
  weeks.forEach((w, wi) =>
    html += `<th class="week-header" colspan="${w.filter(Boolean).length}">WEEK ${wi + 1}</th>`
  );
  html += `<th class="count-col">DONE</th></tr>
           <tr><th class="habit-name-col" style="position:sticky;left:0;z-index:3;background:var(--surface2)"></th>
           <th class="goal-col"></th>`;
  weeks.forEach(w => w.filter(Boolean).forEach(d => {
    const dn  = DAYS[new Date(y, m, d).getDay()];
    const isT = isCM && d === todayDate;
    html += `<th class="${isT ? 'today-header' : ''}" style="min-width:32px">
      ${isT ? '<div class="today-dot"></div>' : ''}
      <div>${dn[0]}</div>
      <div style="color:var(--text);font-weight:700">${d}</div>
    </th>`;
  }));
  html += `<th class="count-col"></th></tr></thead><tbody>`;

  filtered.forEach(h => {
    const count  = monthCounts[h.id] || 0;
    const pct    = Math.round(count / Math.max(h.goal, 1) * 100);
    const cColor = count >= h.goal ? 'var(--accent)' : count >= h.goal * 0.7 ? 'var(--accent3)' : 'var(--text2)';
    const cat    = CAT_COLORS[h.category] || CAT_COLORS.Other;
    const streak = getStreak(h.id);

    html += `<tr draggable="true" data-id="${h.id}"
      ondragstart="dragStart(event,${h.id})" ondragover="dragOver(event)"
      ondrop="dragDrop(event,${h.id})" ondragend="dragEnd(event)">`;
    html += `<td class="habit-name-col">
      <div style="display:flex;align-items:center;gap:4px;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden">
          <span class="drag-handle">⠿</span>
          <span>${h.emoji}</span>
          ${settings.showCatBadges !== false
            ? `<span class="cat-badge" style="background:${cat.bg};color:${cat.color}">${h.category}</span>`
            : ''}
          <span style="overflow:hidden;text-overflow:ellipsis">${h.name}</span>
          ${h.reminder ? `<span class="reminder-icon set" title="Reminder: ${h.reminder}">⏰</span>` : ''}
          ${settings.showStreaks !== false && streak >= 3
            ? `<span class="streak-pill">🔥${streak}</span>`
            : ''}
        </div>
        <button class="del-btn" onclick="deleteHabit(${h.id})">✕</button>
      </div>
      <div class="mini-bar"><div class="mini-bar-fill" style="width:${Math.min(pct,100)}%"></div></div>
    </td>`;
    html += `<td class="goal-col">${h.goal}</td>`;

    weeks.forEach(w => w.filter(Boolean).forEach(d => {
      const k    = dateKey(y, m, d);
      const done = isComplete(h.id, k);
      const isT  = isCM && d === todayDate;
      const isFut= isCM && d > todayDate && !settings.allowFuture;
      let cls    = 'check-cell';
      if (done)  cls += ' done';
      if (isFut) cls += ' future';
      if (isT)   cls += ' today-col';
      html += `<td class="${cls}" ${isFut ? '' : `onclick="toggleCell(${h.id},'${k}')"`}></td>`;
    }));

    html += `<td class="count-col" style="color:${cColor};font-weight:700">${count}</td></tr>`;
  });

  html += `<tr>
    <td class="habit-name-col" colspan="100"
      style="cursor:pointer;padding:10px 14px !important;background:var(--surface2) !important"
      onclick="openModal()">
      <span style="color:var(--accent);margin-right:8px">+</span>
      <span style="color:var(--text2);font-size:0.8rem">Add new habit...</span>
    </td>
  </tr></tbody>`;

  document.getElementById('habitGrid').innerHTML = html;
}

function toggleCell(hid, key)  { toggle(hid, key); checkMilestones(); playCheckSound(); renderAll(); }
function deleteHabit(id) {
  if (!confirm('Remove this habit?')) return;
  state.habits = state.habits.filter(h => h.id !== id);
  save(); renderAll();
}

// ══════════════════════════════════════════════
// 8. TODAY VIEW
// ══════════════════════════════════════════════

function renderToday() {
  const today = new Date();
  const k     = todayKey();
  document.getElementById('todayDateLabel').textContent =
    `${DAYS[today.getDay()]}, ${MONTHS[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  const done  = state.habits.filter(h => isComplete(h.id, k)).length;
  const total = state.habits.length;
  const pct   = total > 0 ? Math.round(done / total * 100) : 0;

  document.getElementById('todayProgressFill').style.width = `${pct}%`;
  document.getElementById('todayPctLabel').textContent     = `${done}/${total}`;

  document.getElementById('todayList').innerHTML = state.habits.map(h => {
    const checked = isComplete(h.id, k);
    const streak  = getStreak(h.id);
    return `<div class="today-habit-item ${checked ? 'checked' : ''}" onclick="toggleTodayHabit(${h.id})">
      <div class="today-check">${checked ? '✓' : ''}</div>
      <div class="today-habit-emoji">${h.emoji}</div>
      <div class="today-habit-name">${h.name}</div>
      ${streak > 0 ? `<div class="today-streak">🔥 ${streak}d</div>` : ''}
    </div>`;
  }).join('');
}

function toggleTodayHabit(hid) {
  toggle(hid, todayKey());
  checkMilestones();
  renderAll();
  renderToday();
}

// ══════════════════════════════════════════════
// 9. YEARLY HEATMAP
// ══════════════════════════════════════════════

function renderHeatmap() {
  const today   = new Date();
  const maxH    = state.habits.length || 1;
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const cols = [], monthLabels = [];
  let col = [], lastMonth = -1;
  const cur = new Date(startDate);

  while (cur <= today) {
    const k     = dateKey(cur.getFullYear(), cur.getMonth(), cur.getDate());
    const count = (state.completions[k] || []).length;
    const level = count === 0 ? 0
      : count < maxH * 0.25 ? 1
      : count < maxH * 0.5  ? 2
      : count < maxH * 0.75 ? 3 : 4;
    col.push({ level, tip: `${MONTHS[cur.getMonth()].slice(0,3)} ${cur.getDate()} — ${count} habits` });
    if (col.length === 7) { cols.push(col); col = []; }
    if (cur.getMonth() !== lastMonth) {
      monthLabels.push({ col: cols.length, label: MONTHS[cur.getMonth()].slice(0, 3) });
      lastMonth = cur.getMonth();
    }
    cur.setDate(cur.getDate() + 1);
  }
  if (col.length) cols.push(col);

  let html = `<div style="display:inline-flex;flex-direction:column;gap:0">
    <div style="display:flex;gap:3px;margin-bottom:4px">`;
  cols.forEach((_, ci) => {
    const lbl = monthLabels.find(l => l.col === ci);
    html += `<div style="min-width:13px;font-family:'Space Mono',monospace;font-size:0.58rem;color:var(--text2)">${lbl ? lbl.label : ''}</div>`;
  });
  html += `</div><div style="display:flex;gap:3px">`;
  cols.forEach(col => {
    html += `<div style="display:flex;flex-direction:column;gap:3px">`;
    col.forEach(cell =>
      html += `<div class="heatmap-cell hm-level-${cell.level}" data-tip="${cell.tip}"></div>`
    );
    html += `</div>`;
  });
  html += `</div></div>`;
  document.getElementById('heatmapWrap').innerHTML = html;
}

// ══════════════════════════════════════════════
// 10. SMART INSIGHTS
// ══════════════════════════════════════════════

function renderInsights() {
  const insights = [], today = new Date();
  const dayTotals = Array(7).fill(0), dayCounts = Array(7).fill(0);
  for (let i = 0; i < 90; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    const c = (state.completions[k] || []).length;
    dayTotals[d.getDay()] += c; dayCounts[d.getDay()]++;
  }
  const dayAvg  = dayTotals.map((t, i) => (dayCounts[i] > 0 ? t / dayCounts[i] : 0));
  const bestDow = dayAvg.indexOf(Math.max(...dayAvg));
  if (dayAvg[bestDow] > 0)
    insights.push({ icon: '📅', text: `You complete the most habits on <strong>${DAYS[bestDow]}s</strong> — your strongest day of the week.` });

  const catTotals = {}, mCounts = getMonthCompletions(today.getFullYear(), today.getMonth());
  state.habits.forEach(h => (catTotals[h.category] = (catTotals[h.category] || 0) + (mCounts[h.id] || 0)));
  const bestCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  if (bestCat)
    insights.push({ icon: '🏅', text: `Your strongest category this month is <strong>${bestCat[0]}</strong> with ${bestCat[1]} completions.` });

  const last7      = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - i);
    return (state.completions[dateKey(d.getFullYear(), d.getMonth(), d.getDate())] || []).length;
  });
  const activeDays = last7.filter(v => v > 0).length;
  insights.push({
    icon: '📊',
    text: `You were active <strong>${activeDays} of the last 7 days</strong>. ${activeDays >= 5 ? 'Excellent consistency! 🔥' : activeDays >= 3 ? 'Keep pushing!' : 'Try to be more consistent this week.'}`,
  });

  let topHabit = null, topStreak = 0;
  state.habits.forEach(h => { const s = getStreak(h.id); if (s > topStreak) { topStreak = s; topHabit = h; } });
  if (topHabit && topStreak > 0)
    insights.push({ icon: '🔥', text: `Your longest current streak is <strong>${topStreak} days</strong> for ${topHabit.emoji} ${topHabit.name}.` });

  document.getElementById('insightsPanel').innerHTML = insights.length
    ? insights.map(i => `<div class="insight-item"><div class="insight-icon">${i.icon}</div><div class="insight-text">${i.text}</div></div>`).join('')
    : `<div style="color:var(--text2);font-size:0.85rem">Complete more habits to unlock insights!</div>`;
}

// ══════════════════════════════════════════════
// 11. WEEKLY REVIEW
// ══════════════════════════════════════════════

function renderWeeklyReview() {
  const today = new Date();
  const sow   = new Date(today); sow.setDate(today.getDate() - today.getDay());
  let totalDone = 0, totalPossible = 0;
  const habitCounts = {};
  state.habits.forEach(h => (habitCounts[h.id] = 0));
  for (let i = 0; i < 7; i++) {
    const d = new Date(sow); d.setDate(sow.getDate() + i);
    if (d > today) continue;
    const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    totalPossible += state.habits.length;
    state.habits.forEach(h => { if (isComplete(h.id, k)) { totalDone++; habitCounts[h.id]++; } });
  }
  const sr     = totalPossible > 0 ? Math.round(totalDone / totalPossible * 100) : 0;
  const sorted = [...state.habits].sort((a, b) => (habitCounts[b.id] || 0) - (habitCounts[a.id] || 0));
  const best   = sorted[0];
  const missed = state.habits.filter(h => (habitCounts[h.id] || 0) === 0);

  document.getElementById('weeklyReview').innerHTML = `
    <div class="review-grid">
      <div class="review-stat"><div class="rv-label">HABITS COMPLETED</div><div class="rv-val">${totalDone}</div><div class="rv-sub">out of ${totalPossible} possible</div></div>
      <div class="review-stat"><div class="rv-label">SUCCESS RATE</div><div class="rv-val" style="color:${sr >= 70 ? 'var(--accent)' : 'var(--accent3)'}">${sr}%</div><div class="rv-sub">${sr >= 80 ? '🔥 Excellent week!' : sr >= 50 ? '💪 Good progress' : '📈 Room to grow'}</div></div>
      <div class="review-stat"><div class="rv-label">BEST HABIT</div><div class="rv-val" style="font-size:1.1rem">${best ? `${best.emoji} ${best.name}` : '—'}</div><div class="rv-sub">${best ? `${habitCounts[best.id]} days this week` : ''}</div></div>
      <div class="review-stat"><div class="rv-label">DAYS ACTIVE</div><div class="rv-val" style="color:var(--accent2)">${today.getDay() + 1}</div><div class="rv-sub">days into this week</div></div>
    </div>
    ${missed.length > 0
      ? `<div style="margin-top:14px">
           <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:var(--text2);letter-spacing:0.1em;margin-bottom:8px">MISSED THIS WEEK</div>
           <div class="missed-list">${missed.map(h => `<span class="missed-tag">${h.emoji} ${h.name}</span>`).join('')}</div>
         </div>`
      : `<div style="margin-top:14px;color:var(--accent);font-size:0.85rem">✨ Perfect week so far!</div>`
    }`;
}

// ══════════════════════════════════════════════
// 12. DASHBOARD CHARTS
// ══════════════════════════════════════════════

let lineChartInst = null, donutChartInst = null, weeklyInsts = [];

function renderDashboard() {
  const { viewYear: y, viewMonth: m } = state;
  const days        = daysInMonth(y, m);
  const totals      = getDailyTotals(y, m);
  const labels      = Array.from({ length: days }, (_, i) => i + 1);
  const monthCounts = getMonthCompletions(y, m);
  const today       = new Date();
  const isCM        = y === today.getFullYear() && m === today.getMonth();
  const doneUpTo    = isCM ? today.getDate() : days;
  const totalDone   = totals.slice(0, doneUpTo).reduce((a, b) => a + b, 0);
  const maxPossible = state.habits.length * doneUpTo;
  const pct         = maxPossible > 0 ? Math.round(totalDone / maxPossible * 100) : 0;
  document.getElementById('donutPct').textContent = `${pct}%`;

  if (lineChartInst) lineChartInst.destroy();
  lineChartInst = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: { labels, datasets: [{ label: 'Habits Completed', data: totals, borderColor: '#00e5b0', backgroundColor: 'rgba(0,229,176,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#00e5b0', borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7a8aa0', font: { family: 'Space Mono', size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7a8aa0', font: { family: 'Space Mono', size: 10 } }, min: 0 } } },
  });

  if (donutChartInst) donutChartInst.destroy();
  donutChartInst = new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: { datasets: [{ data: [pct, 100 - pct], backgroundColor: ['#00e5b0', '#1a2234'], borderWidth: 0, hoverOffset: 4 }] },
    options: { cutout: '70%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { animateRotate: true, duration: 800 } },
  });

  const rankStyles = ['gold', 'silver', 'bronze'];
  document.getElementById('leaderboard').innerHTML = state.habits
    .map(h => ({ ...h, count: monthCounts[h.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((h, i) => `
      <div class="lb-item">
        <span class="lb-rank ${rankStyles[i] || ''}">${i + 1}</span>
        <span class="lb-emoji">${h.emoji}</span>
        <span class="lb-name">${h.name}</span>
        <span class="lb-count">${h.count}</span>
      </div>`)
    .join('');

  const streaks = state.habits.map(h => ({ ...h, streak: getStreak(h.id) })).filter(h => h.streak > 0).sort((a, b) => b.streak - a.streak).slice(0, 8);
  document.getElementById('streakBadges').innerHTML = streaks.length
    ? streaks.map(h => `<div class="streak-badge">${h.emoji} ${h.name} <span class="streak-num">🔥 ${h.streak}d</span></div>`).join('')
    : `<div style="color:var(--text2);font-size:0.8rem">Start completing habits to build streaks!</div>`;

  renderHeatmap();
  renderInsights();
  renderWeeklyReview();

  weeklyInsts.forEach(c => c.destroy()); weeklyInsts = [];
  const weeks = []; let wk = []; const firstDay = new Date(y, m, 1).getDay();
  for (let i = 0; i < firstDay; i++) wk.push(null);
  for (let d = 1; d <= days; d++) { wk.push(d); if (wk.length === 7) { weeks.push(wk); wk = []; } }
  if (wk.length) weeks.push(wk);

  document.getElementById('weeklyCharts').innerHTML = weeks.slice(0, 4)
    .map((w, wi) => `<div class="week-mini-card" style="animation-delay:${wi * 0.05}s"><div class="week-mini-title">WEEK ${wi + 1}</div><div class="mini-chart"><canvas id="wkChart${wi}"></canvas></div></div>`)
    .join('');

  weeks.slice(0, 4).forEach((w, wi) => {
    const dl = w.filter(Boolean).map(d => DAYS[new Date(y, m, d).getDay()][0]);
    const dd = w.filter(Boolean).map(d => (state.completions[dateKey(y, m, d)] || []).length);
    weeklyInsts.push(new Chart(document.getElementById(`wkChart${wi}`), {
      type: 'bar',
      data: { labels: dl, datasets: [{ data: dd, backgroundColor: dd.map(v => v > 0 ? 'rgba(0,229,176,0.7)' : 'rgba(255,255,255,0.05)'), borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#7a8aa0', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7a8aa0', font: { size: 9 }, maxTicksLimit: 4 }, min: 0 } } },
    }));
  });
}

// ══════════════════════════════════════════════
// 13. MONTH NAVIGATION
// ══════════════════════════════════════════════

function updateMonthLabel() {
  document.getElementById('monthLabel').textContent = `${MONTHS[state.viewMonth]} ${state.viewYear}`;
}

document.getElementById('prevMonth').onclick = () => {
  state.viewMonth--;
  if (state.viewMonth < 0) { state.viewMonth = 11; state.viewYear--; }
  save(); renderAll();
};
document.getElementById('nextMonth').onclick = () => {
  state.viewMonth++;
  if (state.viewMonth > 11) { state.viewMonth = 0; state.viewYear++; }
  save(); renderAll();
};

// ══════════════════════════════════════════════
// 14. TAB SWITCHING
// ══════════════════════════════════════════════

function switchTab(tab, el) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`view-${tab}`).classList.add('active');
  if (el) el.classList.add('active');
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'today')     renderToday();
  if (tab === 'settings')  { renderSettingsProfile(); renderTodayQuote(); updateNotifStatus(); }
}

// ══════════════════════════════════════════════
// 15. MODALS — ADD HABIT & TEMPLATES
// ══════════════════════════════════════════════

function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('newHabitName').focus();
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  ['newHabitEmoji', 'newHabitName', 'newHabitGoal', 'newHabitReminder'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('newHabitCategory').value = 'Health';
}
function confirmAddHabit() {
  const name = document.getElementById('newHabitName').value.trim();
  if (!name) return;
  const emoji    = document.getElementById('newHabitEmoji').value.trim() || '⭐';
  const goal     = parseInt(document.getElementById('newHabitGoal').value) || (settings.defaultGoal || 30);
  const category = document.getElementById('newHabitCategory').value || 'Other';
  const reminder = document.getElementById('newHabitReminder').value || '';
  const newId    = Math.max(0, ...state.habits.map(h => h.id)) + 1;
  state.habits.push({ id: newId, emoji, name, goal, category, reminder });
  save(); closeModal(); renderAll();
  if (reminder) requestNotifPermission();
}
document.getElementById('modalOverlay').onclick = e => { if (e.target === e.currentTarget) closeModal(); };

function openTemplates() {
  document.getElementById('templateGrid').innerHTML = Object.entries(TEMPLATES)
    .map(([name, t]) => `
      <div class="template-card" onclick="applyTemplate('${name}')">
        <div class="tc-icon">${t.icon}</div>
        <div class="tc-name">${name}</div>
        <div class="tc-count">${t.habits.length} habits</div>
      </div>`)
    .join('');
  document.getElementById('templatesOverlay').classList.add('open');
}
function closeTemplates() { document.getElementById('templatesOverlay').classList.remove('open'); }
function applyTemplate(name) {
  const t = TEMPLATES[name]; if (!t) return;
  const existing = state.habits.map(h => h.name.toLowerCase());
  let added = 0;
  t.habits.forEach(h => {
    if (existing.includes(h.name.toLowerCase())) return;
    const newId = Math.max(0, ...state.habits.map(h => h.id)) + 1;
    state.habits.push({ id: newId, reminder: '', ...h });
    added++;
  });
  save(); closeTemplates(); renderAll();
  showToast(`✅ Template Applied`, `Added ${added} new habits from "${name}".`);
}
document.getElementById('templatesOverlay').onclick = e => { if (e.target === e.currentTarget) closeTemplates(); };

// ══════════════════════════════════════════════
// 16. DRAG & DROP REORDERING
// ══════════════════════════════════════════════

let dragSrcId = null;
function dragStart(e, id) { dragSrcId = id; e.currentTarget.classList.add('dragging'); }
function dragEnd(e)        { e.currentTarget.classList.remove('dragging'); dragSrcId = null; }
function dragOver(e)       { e.preventDefault(); }
function dragDrop(e, tId)  {
  e.preventDefault();
  if (dragSrcId === null || dragSrcId === tId) return;
  const fi = state.habits.findIndex(h => h.id === dragSrcId);
  const ti = state.habits.findIndex(h => h.id === tId);
  if (fi < 0 || ti < 0) return;
  const [mv] = state.habits.splice(fi, 1);
  state.habits.splice(ti, 0, mv);
  save(); renderGrid();
}

// ══════════════════════════════════════════════
// 17. SETTINGS
// ══════════════════════════════════════════════

/** Apply dark / light colour mode */
function applyColorMode(mode) {
  document.body.classList.toggle('light-mode', mode === 'light');
  saveSetting('colorMode', mode);
  const btnDark  = document.getElementById('btnDark');
  const btnLight = document.getElementById('btnLight');
  if (btnDark)  btnDark.classList.toggle('active',  mode === 'dark');
  if (btnLight) btnLight.classList.toggle('active', mode === 'light');
}

/** Apply an accent theme preset */
function applyTheme(name) {
  const t = THEMES[name] || THEMES.default;
  document.documentElement.style.setProperty('--accent', t.accent);
  document.documentElement.style.setProperty('--accent2', t.accent2);
  const picker = document.getElementById('accentColorPicker');
  if (picker) picker.value = t.accent;
  saveSetting('theme', name); saveSetting('accentColor', t.accent);
  document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.theme === name));
}

/** Apply a custom hex accent colour */
function applyCustomAccent(val) {
  document.documentElement.style.setProperty('--accent', val);
  saveSetting('accentColor', val); saveSetting('theme', 'custom');
  document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
}

function applyCompactMode(on) {
  saveSetting('compactMode', on);
  document.querySelectorAll('.habit-grid th, .habit-grid td').forEach(el => (el.style.height = on ? '28px' : '38px'));
}

function applyGridLines(on) {
  saveSetting('showGridLines', on);
  document.querySelectorAll('.habit-grid th, .habit-grid td').forEach(el => (el.style.border = on ? '' : 'none'));
}

function applyFontSize(size) {
  saveSetting('fontSize', size);
  const map = { small: '13px', normal: '16px', large: '19px' };
  document.documentElement.style.fontSize = map[size] || '16px';
}

/** Restore all settings from localStorage on app load */
function applyAllSettings() {
  applyColorMode(settings.colorMode || 'dark');
  if (settings.theme && settings.theme !== 'custom') applyTheme(settings.theme);
  else if (settings.accentColor) {
    document.documentElement.style.setProperty('--accent', settings.accentColor);
    const picker = document.getElementById('accentColorPicker');
    if (picker) picker.value = settings.accentColor;
  }
  if (settings.fontSize) applyFontSize(settings.fontSize);

  const sync = (id, val) => {
    const el = document.getElementById(id); if (!el) return;
    if (el.type === 'checkbox') el.checked = !!val; else el.value = val;
  };
  sync('compactMode',       settings.compactMode);
  sync('showGridLines',     settings.showGridLines !== false);
  sync('fontSizeSelect',    settings.fontSize || 'normal');
  sync('weekStartSelect',   settings.weekStart ?? 0);
  sync('defaultGoalSelect', settings.defaultGoal || 30);
  sync('showStreaks',        settings.showStreaks !== false);
  sync('showCatBadges',     settings.showCatBadges !== false);
  sync('allowFuture',       !!settings.allowFuture);
  sync('showQuote',         settings.showQuote !== false);
  sync('showCelebrations',  settings.showCelebrations !== false);
  sync('soundEnabled',      !!settings.soundEnabled);
  sync('xpEnabled',         settings.xpEnabled !== false);
  sync('xpPerHabit',        settings.xpPerHabit || 10);
  if (settings.theme)
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.theme === settings.theme));
  updateNotifStatus();
}

function updateNotifStatus() {
  const el = document.getElementById('notifStatus'); if (!el) return;
  if (!('Notification' in window)) { el.textContent = 'Not supported in this browser'; return; }
  const map = { granted: '✅ Enabled', denied: '❌ Blocked — allow in browser settings', default: '⚠ Not yet enabled' };
  el.textContent = map[Notification.permission] || '';
}

/* Focus Timer */
let focusInterval = null, focusSeconds = 25 * 60, focusRunning = false;
function setFocusTime(mins) {
  focusSeconds = mins * 60; focusRunning = false;
  clearInterval(focusInterval);
  document.getElementById('focusStartBtn').textContent = '▶ Start';
  updateFocusDisplay();
  document.querySelectorAll('.focus-preset').forEach(b => b.classList.toggle('active', b.textContent.includes(mins)));
}
function updateFocusDisplay() {
  const mm = Math.floor(focusSeconds / 60), ss = focusSeconds % 60;
  document.getElementById('focusTimerDisplay').textContent = `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}
function toggleFocusTimer() {
  if (focusRunning) {
    clearInterval(focusInterval); focusRunning = false;
    document.getElementById('focusStartBtn').textContent = '▶ Resume';
  } else {
    focusRunning = true;
    document.getElementById('focusStartBtn').textContent = '⏸ Pause';
    focusInterval = setInterval(() => {
      focusSeconds--;
      updateFocusDisplay();
      if (focusSeconds <= 0) {
        clearInterval(focusInterval); focusRunning = false;
        document.getElementById('focusStartBtn').textContent = '▶ Start';
        showToast('⏱ Focus Session Done!', 'Great work! Take a 5-minute break.');
        if (settings.soundEnabled) playBeep();
      }
    }, 1000);
  }
}
function resetFocusTimer() {
  clearInterval(focusInterval); focusRunning = false; focusSeconds = 25 * 60;
  updateFocusDisplay();
  document.getElementById('focusStartBtn').textContent = '▶ Start';
}

/* Sound */
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
  } catch (e) { /* silently fail */ }
}
function playCheckSound() {
  if (!settings.soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 600;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
  } catch (e) { /* silently fail */ }
}

/* Daily Quotes */
let currentQuoteIdx = -1;
function renderTodayQuote(force = false) {
  const qc = document.getElementById('quoteCard'); if (!qc) return;
  qc.style.display = settings.showQuote ? 'block' : 'none';
  if (!settings.showQuote) return;
  if (force || currentQuoteIdx === -1) currentQuoteIdx = Math.floor(Math.random() * QUOTES.length);
  const q = QUOTES[currentQuoteIdx];
  const qt = document.getElementById('quoteText');
  const qa = document.getElementById('quoteAuthor');
  if (qt) qt.textContent = `"${q.text}"`;
  if (qa) qa.textContent = `— ${q.author}`;
}

/* Settings Profile Panel */
function renderSettingsProfile() {
  const lvl = Math.floor((state.xp || 0) / 100) + 1;
  const el1 = document.getElementById('settingsLevel');  if (el1) el1.textContent = `LVL ${lvl}`;
  const el2 = document.getElementById('settingsXP');     if (el2) el2.textContent = `${state.xp || 0} XP total`;
  const totalComp  = Object.values(state.completions).reduce((a, b) => a + b.length, 0);
  const daysActive = Object.keys(state.completions).filter(k => state.completions[k].length > 0).length;
  const tc  = document.getElementById('totalHabitsCount');  if (tc)  tc.textContent  = state.habits.length;
  const tco = document.getElementById('totalCompletions');  if (tco) tco.textContent = totalComp;
  const tdt = document.getElementById('totalDaysTracked');  if (tdt) tdt.textContent = daysActive;
}

function resetXP() {
  if (!confirm('Reset your XP and level to 0?')) return;
  state.xp = 0; state.seenMilestones = {};
  save(); renderXP(); renderStats();
  showToast('⚡ XP Reset', 'Your experience points have been reset to 0.');
}

// ══════════════════════════════════════════════
// 18. DATA EXPORT / IMPORT
// ══════════════════════════════════════════════

function exportCSV() {
  const { viewYear: y, viewMonth: m } = state;
  const days = daysInMonth(y, m);
  let csv = `Habit,Category,Goal,${Array.from({ length: days }, (_, i) => i + 1).join(',')},Total\n`;
  state.habits.forEach(h => {
    const row = [h.name, h.category, h.goal]; let total = 0;
    for (let d = 1; d <= days; d++) {
      const v = isComplete(h.id, dateKey(y, m, d)) ? 1 : 0;
      row.push(v); total += v;
    }
    row.push(total);
    csv += row.join(',') + '\n';
  });
  _download(`habits-${MONTHS[m]}-${y}.csv`, 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
}

function exportJSON() {
  const data = JSON.stringify({ state, settings }, null, 2);
  _download(`habitos-backup-${new Date().toISOString().slice(0, 10)}.json`, 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
}

function importJSON(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.state)    { state    = data.state;    save(); }
      if (data.settings) { settings = data.settings; localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); applyAllSettings(); }
      renderAll(); showToast('✅ Import Successful', 'Your backup has been restored.');
    } catch (err) { showToast('❌ Import Failed', 'Invalid backup file.'); }
  };
  reader.readAsText(file);
}

function clearMonth() {
  if (!confirm('Clear all completions for this month?')) return;
  const { viewYear: y, viewMonth: m } = state, days = daysInMonth(y, m);
  for (let d = 1; d <= days; d++) delete state.completions[dateKey(y, m, d)];
  save(); renderAll(); showToast('🗑 Month Cleared', 'All completions for this month have been reset.');
}

function deleteAllData() {
  if (!confirm('DELETE ALL DATA? This cannot be undone!')) return;
  if (!confirm('Are you absolutely sure? All habits and history will be lost.')) return;
  localStorage.removeItem(STATE_KEY); localStorage.removeItem(SETTINGS_KEY);
  location.reload();
}

function _download(filename, dataUrl) {
  const a = document.createElement('a');
  a.href     = dataUrl;
  a.download = filename;
  a.click();
}

// ══════════════════════════════════════════════
// 19. KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeTemplates(); closeCelebration(); }
  if (e.key === 'Enter' && document.getElementById('modalOverlay').classList.contains('open'))
    confirmAddHabit();
});

// Smart home link (works locally with file:// and when deployed)
const homeLink = document.querySelector('a[href="index.html"]');
if (homeLink) {
  homeLink.addEventListener('click', e => {
    e.preventDefault();
    const isLocal = location.protocol === 'file:';
    window.location.href = isLocal
      ? location.href.replace(/app\.html.*$/, '').replace(/\/$/, '') + '/index.html'
      : 'index.html';
  });
}

// ══════════════════════════════════════════════
// 20. INITIALISATION
// ══════════════════════════════════════════════

function renderAll() {
  updateMonthLabel();
  renderStats();
  renderGrid();
  renderXP();
}

applyAllSettings();
renderAll();
