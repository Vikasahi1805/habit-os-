# HabitOS — Gamified Daily Habit Tracker

> Turn your daily routine into an RPG. Track habits, earn XP, build streaks, and level up your life.

![HabitOS Banner](docs/assets/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Firebase Setup](#firebase-setup)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Data Models](#data-models)
- [Settings System](#settings-system)
- [Adding New Features](#adding-new-features)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

---

## Overview

HabitOS is a fully client-side web application built with vanilla HTML, CSS, and JavaScript. It requires no build tools, no frameworks, and no server beyond static file hosting. The app uses Firebase for optional cloud authentication and real-time data sync, falling back gracefully to localStorage when Firebase is not configured.

The app consists of two pages:
- **`index.html`** — Public-facing landing page showcasing features
- **`app.html`** — The full habit tracking application

---

## Live Demo

> 🔗 **[habitos.netlify.app](https://habitos.netlify.app)** _(replace with your URL after deployment)_

---

## Features

### Core Tracking
| Feature | Description |
|---|---|
| Monthly Grid | Full calendar grid with daily checkboxes (Mon–Sun grouped by week) |
| 13 Default Habits | Pre-loaded habits with emojis across Health, Productivity, Mindfulness, Finance |
| Custom Habits | Add unlimited habits with emoji, name, goal, category, and reminder time |
| Habit Categories | Health · Productivity · Mindfulness · Finance · Other with coloured badges |
| Goal Tracking | Per-habit monthly target with live progress bar |
| Drag & Drop | Reorder habits by dragging — persisted to localStorage |

### Dashboard & Analytics
| Feature | Description |
|---|---|
| Monthly Line Chart | Area chart showing daily completions across the month |
| Completion Donut | Ring chart displaying monthly completion percentage |
| Weekly Bar Charts | 4 individual bar charts, one per week |
| Top 10 Leaderboard | Ranked habits by monthly completions with medals |
| Yearly Heatmap | GitHub-style 365-day contribution grid with 5 intensity levels |
| Smart Insights | AI-pattern analysis: best day, top category, consistency score, streak leader |
| Weekly Review | Weekly summary: done count, success rate, best habit, missed habits |
| Streak Badges | All active streaks displayed with flame emoji |

### Gamification
| Feature | Description |
|---|---|
| XP System | +10 XP per completed habit (configurable), displayed in header bar |
| Level System | Level increases every 100 XP, shown as badge in header |
| Streak Tracking | Per-habit consecutive day counter |
| Milestone Celebrations | Confetti popup at 7, 30, 60, and 100 day streaks |

### Today Mode
- Simplified checklist view showing only today's habits
- One-tap completion with animated checkbox
- Live progress bar and completion ratio
- Per-habit streak indicator

### Reminders
- Set custom time per habit
- Browser Notification API (with permission prompt)
- In-app toast fallback when notifications are blocked
- Checks every 60 seconds via `setInterval`

### Settings
| Section | Options |
|---|---|
| Appearance | Colour mode (Dark/Light), 6 accent themes, custom colour picker, compact mode, grid lines, font size |
| Tracking | Week start day, default goal, show/hide streaks, show/hide category badges, allow future check-ins |
| Notifications | Permission status, daily quotes, celebrations, sound effects |
| Gamification | XP on/off, XP per habit amount, reset XP |
| Focus Timer | Built-in Pomodoro timer with 25/45/60 min presets |
| Daily Motivation | Rotating inspirational quotes with refresh |
| Data & Privacy | Export CSV, Export JSON, Import JSON, clear month, delete all |
| About | Version info, total habits, completions, days active |

### User Accounts (Firebase)
- Google Sign-In via Firebase Authentication
- Real-time Firestore sync — data updates across all devices instantly
- Guest mode — full functionality with localStorage only
- Graceful fallback when Firebase is not configured

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Charts | [Chart.js 4.4.1](https://www.chartjs.org/) via CDN |
| Fonts | Google Fonts — Space Mono, Syne |
| Auth | Firebase Authentication (Google provider) |
| Database | Cloud Firestore (real-time sync) |
| Storage | localStorage (offline/guest mode) |
| Hosting | Netlify / GitHub Pages / Vercel / Cloudflare Pages |
| Build Tools | **None** — zero dependencies, zero build step |

---

## Project Structure

```
habitos/
│
├── index.html              # Landing page (public-facing)
├── app.html                # Main application
│
├── docs/                   # Documentation & assets
│   ├── assets/
│   │   ├── banner.png      # README banner image
│   │   └── screenshot.png  # App screenshot
│   ├── ARCHITECTURE.md     # Deep-dive architecture notes
│   └── FIREBASE_SETUP.md   # Step-by-step Firebase guide
│
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── README.md               # This file
├── CHANGELOG.md            # Version history
├── CONTRIBUTING.md         # Contribution guidelines
└── LICENSE                 # MIT License
```

---

## Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code recommended)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension (for local development)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/habitos.git
cd habitos

# 2. Open in VS Code
code .

# 3. Right-click index.html → Open with Live Server
# OR open index.html directly in Chrome (links work via smart router)
```

> **Note:** No `npm install`, no `package.json`, no build process. Just open and run.

### Testing Without Firebase

Click **"Continue without account"** on the auth screen. All features work in guest mode using localStorage. Firebase is only needed for cross-device sync.

---

## Firebase Setup

> Full step-by-step guide: [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md)

**Quick Setup (5 minutes):**

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project → Add Web App → Copy `firebaseConfig`
3. Open `app.html` and find the config block (around line 20):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← Replace these
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. In Firebase Console:
   - **Authentication** → Sign-in method → Enable **Google**
   - **Firestore Database** → Create database → Start in **test mode**

5. Deploy — Firebase will work automatically.

---

## Deployment

### Option 1: Netlify Drop (Recommended — 30 seconds)
1. Go to [netlify.com](https://netlify.com) → Sign up free
2. Drag your project folder onto the deploy zone
3. Live at `https://your-name.netlify.app`

### Option 2: GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/habitos.git
git push -u origin main
```
Then: Repository Settings → Pages → Source: `main` branch → `/root`

Live at: `https://yourusername.github.io/habitos`

### Option 3: Vercel
```bash
npm i -g vercel
vercel --prod
```

### Option 4: Cloudflare Pages
Go to [pages.cloudflare.com](https://pages.cloudflare.com) → Connect GitHub → Auto-deploy on push.

---

## Architecture

### Application Flow

```
User visits index.html
       │
       ▼
Landing Page (index.html)
  ├── Smart link router detects file:// vs https://
  └── Navigates to app.html on CTA click
       │
       ▼
app.html loads
  ├── Firebase module initialises (ES module, async)
  │     ├── Firebase configured? → Show auth screen
  │     └── Not configured?     → Show app directly (guest mode)
  │
  ├── Auth Screen
  │     ├── Google Sign-In → Firebase Auth → onAuthStateChanged
  │     └── Continue as Guest → localStorage only
  │
  └── App Initialises
        ├── Load state from localStorage
        ├── If signed in: load from Firestore (overrides localStorage)
        ├── applyAllSettings()  ← restores user preferences
        └── renderAll()         ← renders tracker, stats, XP
```

### State Management

HabitOS uses a single global `state` object that is serialised to JSON and stored in `localStorage` under the key `habitosState3`. When Firebase is configured and a user is signed in, state is also synced to Firestore under `users/{uid}/state`.

```javascript
// Core state shape
state = {
  habits: [
    {
      id: Number,          // Unique auto-incremented ID
      emoji: String,       // e.g. "🌅"
      name: String,        // e.g. "Wake up at 6AM"
      goal: Number,        // Monthly target, e.g. 30
      category: String,    // "Health" | "Productivity" | "Mindfulness" | "Finance" | "Other"
      reminder: String,    // "HH:MM" format or ""
    }
  ],
  completions: {
    "YYYY-MM-DD": [habitId, habitId, ...]  // Array of completed habit IDs per day
  },
  viewYear: Number,        // Currently viewed year
  viewMonth: Number,       // Currently viewed month (0-indexed)
  xp: Number,              // Total XP earned
  seenMilestones: {        // Tracks which streak celebrations have shown
    "{habitId}_{days}": true
  }
}
```

### Settings State

User preferences are stored separately under `habitosSettings`:

```javascript
settings = {
  colorMode: "dark" | "light",
  theme: "default" | "purple" | "orange" | "red" | "ice" | "gold" | "custom",
  accentColor: String,     // Hex colour e.g. "#00e5b0"
  compactMode: Boolean,
  showGridLines: Boolean,
  fontSize: "small" | "normal" | "large",
  weekStart: 0 | 1 | 6,   // 0=Sun, 1=Mon, 6=Sat
  defaultGoal: Number,
  showStreaks: Boolean,
  showCatBadges: Boolean,
  allowFuture: Boolean,
  showQuote: Boolean,
  showCelebrations: Boolean,
  soundEnabled: Boolean,
  xpEnabled: Boolean,
  xpPerHabit: Number,      // Default 10
}
```

### Rendering Pipeline

Every state change calls `renderAll()` which triggers:
```
renderAll()
  ├── updateMonthLabel()   → updates header month/year display
  ├── renderStats()        → recalculates and redraws 4 stat cards
  ├── renderGrid()         → rebuilds full habit grid HTML
  └── renderXP()           → updates level badge and XP bar
```

Dashboard renders separately (on tab switch):
```
renderDashboard()
  ├── Line chart (Chart.js)
  ├── Donut chart (Chart.js)
  ├── Leaderboard
  ├── Streak badges
  ├── renderHeatmap()      → 365-day grid
  ├── renderInsights()     → pattern analysis
  ├── renderWeeklyReview() → this week summary
  └── 4× Weekly bar charts (Chart.js)
```

---

## Data Models

### Habit Object
```javascript
{
  id: 1,
  emoji: "💪",
  name: "Gym Workout",
  goal: 20,
  category: "Health",
  reminder: "07:00"   // or "" if no reminder
}
```

### Completions Object
```javascript
// Key = ISO date string, Value = array of completed habit IDs
{
  "2026-03-15": [1, 3, 5, 7],
  "2026-03-16": [1, 2, 3, 4, 5, 6, 7],
  "2026-03-17": [1, 3]
}
```

### Firestore Document
```
Collection: users
  Document: {uid}
    Field: state  (JSON string of the entire state object)
```

---

## Settings System

The settings system works through a `settings` object that is:
1. Loaded from `localStorage` on app start
2. Applied via `applyAllSettings()` which syncs all DOM controls
3. Updated via `saveSetting(key, value)` on any change

### Adding a New Setting

```javascript
// 1. Add default value to the settings object
let settings = JSON.parse(...) || {
  // ... existing settings ...
  myNewSetting: false,   // ← add here
};

// 2. Add HTML toggle/select in the Settings view
<div class="settings-row">
  <div class="settings-row-info">
    <div class="settings-row-label">My New Setting</div>
    <div class="settings-row-sub">Description of what it does</div>
  </div>
  <label class="toggle">
    <input type="checkbox" id="myNewSetting"
      onchange="saveSetting('myNewSetting', this.checked); applyMyNewSetting(this.checked)">
    <span class="toggle-slider"></span>
  </label>
</div>

// 3. Add apply function
function applyMyNewSetting(value) {
  // implement the actual effect
}

// 4. Add to applyAllSettings() to restore on load
sync('myNewSetting', settings.myNewSetting);
```

---

## Adding New Features

### Adding a New Tab/View

```javascript
// 1. Add tab button in header
<button class="tab" onclick="switchTab('myview', this)">MY VIEW</button>

// 2. Add view div in <main>
<div class="view" id="view-myview">
  <div style="padding:20px">
    <!-- your content here -->
  </div>
</div>

// 3. Add case in switchTab()
function switchTab(tab, el) {
  // ... existing code ...
  if (tab === 'myview') renderMyView();
}

// 4. Write your render function
function renderMyView() {
  document.getElementById('view-myview').innerHTML = `...`;
}
```

### Adding a New Chart

```javascript
// 1. Add canvas element in your view
<div style="height:200px"><canvas id="myChart"></canvas></div>

// 2. Create Chart.js instance
let myChartInst = null;
function renderMyChart() {
  if (myChartInst) myChartInst.destroy();
  myChartInst = new Chart(document.getElementById('myChart'), {
    type: 'bar',  // 'line' | 'bar' | 'doughnut' | 'pie' | 'radar'
    data: {
      labels: [...],
      datasets: [{ data: [...], backgroundColor: '#00e5b0' }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}
```

### Adding a New Habit Category

```javascript
// 1. Add to CAT_COLORS in app.html
const CAT_COLORS = {
  // ... existing ...
  'Relationships': { bg: 'rgba(236,72,153,0.15)', color: '#ec4899' },
};

// 2. Add option to all <select> elements with categories
<option value="Relationships">💕 Relationships</option>
// (appears in: catFilter, newHabitCategory, template habits)
```

### Adding a New Template

```javascript
const TEMPLATES = {
  // ... existing templates ...
  'Sleep Routine': {
    icon: '😴',
    habits: [
      { emoji: '📵', name: 'No screens after 9PM', goal: 30, category: 'Health' },
      { emoji: '🫖', name: 'Herbal tea before bed',  goal: 30, category: 'Health' },
      { emoji: '📖', name: 'Read before sleeping',   goal: 30, category: 'Mindfulness' },
      { emoji: '😴', name: 'In bed by 10:30PM',      goal: 30, category: 'Health' },
    ]
  },
};
```

### Adding a Streak Milestone

```javascript
// Change the STREAK_MILESTONES array
const STREAK_MILESTONES = [7, 30, 60, 100, 365];  // add 365

// Add message in showCelebration()
const msgs = {
  // ... existing ...
  365: { emoji: '🌟', title: '365 Day Streak!', sub: `${habit.emoji} ${habit.name} — One full year! INCREDIBLE!` },
};
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Make** your changes — keep the same code style (vanilla JS, no build tools)
4. **Test** in Chrome, Firefox, and mobile
5. **Commit** with a clear message: `git commit -m "feat: add weekly goal reset option"`
6. **Push** to your fork: `git push origin feature/my-feature`
7. **Open** a Pull Request with a clear description

### Code Style Guidelines
- Use vanilla JavaScript only (no frameworks, no imports beyond Firebase)
- Keep all CSS in the `<style>` tag, variables in `:root`
- Follow the existing naming pattern: `renderXxx()` for render functions, `applyXxx()` for settings
- Always call `save()` after mutating `state`, `saveSetting()` after mutating `settings`
- Destroy Chart.js instances before recreating: `if (inst) inst.destroy()`
- Use `var(--accent)` and other CSS variables for all colours — never hardcode

### Commit Message Format
```
feat: add new feature
fix: fix a bug
style: UI/CSS changes only
refactor: code restructure, no feature change
docs: documentation updates
```

---

## Changelog

### v2.0.0 (March 2026)
- ✅ Added Firebase Authentication with Google Sign-In
- ✅ Added Firestore real-time cloud sync
- ✅ Added landing page (index.html)
- ✅ Added 10 new features: Daily Reminders, Habit Categories, Yearly Heatmap, Streak Celebrations, XP/Leveling, Smart Insights, Weekly Review, Drag & Drop, Today Mode, Templates
- ✅ Added full Settings panel with 7 sections
- ✅ Added Dark / Light mode toggle
- ✅ Added 6 accent colour themes + custom picker
- ✅ Added built-in Pomodoro focus timer
- ✅ Added JSON export/import for full data backup
- ✅ Fixed file navigation for local (file://) and deployed (https://) environments

### v1.0.0 (March 2026)
- ✅ Initial release: monthly grid, dashboard, streaks, CSV export

---

## License

MIT License — see [LICENSE](LICENSE) for details.

You are free to use, modify, and distribute this project for personal and commercial purposes.

---

<div align="center">
  Built with ♥ · <a href="https://github.com/yourusername/habitos">GitHub</a> · <a href="https://habitos.netlify.app">Live Demo</a>
</div>
