# 🚀 HabitOS — Deployment Guide

Complete instructions for deploying HabitOS for real users.

---

## 📁 Project File Structure

```
habitos/
│
├── index.html              ← Landing page (users see this first)
├── app.html                ← Main application (the actual tracker)
│
├── css/
│   └── app.css             ← All styles (dark mode, light mode, responsive)
│
├── js/
│   ├── firebase.js         ← Firebase auth + Firestore database (ES module)
│   └── app.js              ← All application logic (state, rendering, settings)
│
├── docs/
│   ├── FIREBASE_SETUP.md   ← Step-by-step Firebase setup
│   └── DEPLOYMENT.md       ← This file
│
├── README.md               ← Full project documentation
├── CHANGELOG.md            ← Version history
├── CONTRIBUTING.md         ← How to contribute
├── LICENSE                 ← MIT License
└── .gitignore              ← Git ignore rules
```

---

## ⚙️ Step 1 — Firebase Setup (Required for cloud sync & login)

### 1.1 Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `habitos` → Create
3. Click the **Web icon** (`</>`) → Register app → copy `firebaseConfig`

### 1.2 Paste Config into js/firebase.js
Open `js/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSyAbc123...",       // ← your real values
  authDomain:        "habitos-abc.firebaseapp.com",
  projectId:         "habitos-abc",
  storageBucket:     "habitos-abc.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc"
};
```

### 1.3 Enable Google Auth
- Firebase Console → **Authentication** → Sign-in method → **Google** → Enable → Save

### 1.4 Create Firestore Database
- Firebase Console → **Firestore Database** → Create database → **Start in test mode** → Enable

### 1.5 Set Firestore Security Rules (before going live)
Go to Firestore → Rules tab → replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
Click **Publish**.

---

## 🌐 Step 2 — Deploy to Hosting

Choose any of these options. All are **free**.

---

### Option A: Netlify (Recommended — easiest, 1 minute)

#### Method 1: Drag & Drop (no account needed)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your entire `habitos/` project folder onto the page
3. Done! You get a live URL like `https://random-name-123.netlify.app`

#### Method 2: Connect GitHub (auto-deploys on every push)
1. Push your project to GitHub (see Step 3)
2. Go to [app.netlify.com](https://app.netlify.com) → New site from Git
3. Connect GitHub → Select your repo → Deploy site
4. Every `git push` auto-deploys in ~30 seconds

#### Set custom subdomain (free)
- Netlify Dashboard → Site Settings → Domain Management → Options → Edit site name
- Change to e.g. `habitos` → your URL becomes `https://habitos.netlify.app`

#### Add authorised domain in Firebase
- Firebase Console → Authentication → Settings → Authorised domains → Add domain
- Add: `habitos.netlify.app`

---

### Option B: GitHub Pages (professional, free)

1. Push to GitHub (see Step 3 below)
2. Go to your repo on GitHub
3. Click **Settings** → **Pages** (left sidebar)
4. Under Source: select **Deploy from a branch**
5. Branch: `main` → Folder: `/ (root)` → Save
6. Live at: `https://yourusername.github.io/habitos`

#### Add authorised domain in Firebase
- Add: `yourusername.github.io`

---

### Option C: Vercel (best for scaling)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project folder
cd habitos
vercel --prod
```

Follow prompts. Live URL provided instantly.

#### Or connect GitHub for auto-deploy:
1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select your repo → Deploy
3. Auto-deploys on every push

---

### Option D: Cloudflare Pages (fastest globally)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create application → Connect to Git → Select repo
3. Build settings: leave all blank (static site, no build needed)
4. Deploy
5. Live at `https://habitos.pages.dev`

---

## 📤 Step 3 — Push to GitHub

```bash
# Navigate to your project folder
cd habitos

# Initialise git
git init

# Add all files
git add .

# First commit
git commit -m "feat: HabitOS v2.0 — gamified habit tracker"

# Create GitHub repo at github.com/new
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/habitos.git
git branch -M main
git push -u origin main
```

After this, future updates are just:
```bash
git add .
git commit -m "fix: description of change"
git push
```

---

## ✅ Step 4 — Test Before Sharing

Open your deployed URL and verify:

- [ ] Landing page loads at `/` (index.html)
- [ ] "Start Tracking Free" button navigates to `/app.html`
- [ ] Google Sign-In popup opens and works
- [ ] After sign-in, user name appears in header
- [ ] ☁ synced indicator shows after data saves
- [ ] Guest mode works (click "Continue without account")
- [ ] All 4 tabs work: TRACKER, TODAY, DASHBOARD, SETTINGS
- [ ] Dark/Light mode toggle in Settings → Appearance
- [ ] Habit can be added, checked, deleted
- [ ] Open on a second device/browser — data syncs

---

## 🔧 Step 5 — Optional Improvements Before Launch

### Add a custom domain (e.g. habitos.com)
1. Buy domain at [Namecheap](https://namecheap.com) or [Google Domains](https://domains.google)
2. In Netlify: Domain Management → Add custom domain → follow DNS instructions
3. In Firebase: Authentication → Authorised domains → Add your custom domain
4. HTTPS is automatic (free SSL via Let's Encrypt)

### Add a favicon
Create a 32×32 PNG called `favicon.png` in your root folder.
Add to `<head>` in both HTML files:
```html
<link rel="icon" type="image/png" href="favicon.png">
```

### Add Open Graph meta tags (for nice link previews)
Add to `<head>` in `index.html`:
```html
<meta property="og:title"       content="HabitOS — Gamified Habit Tracker">
<meta property="og:description" content="Turn your daily routine into an RPG.">
<meta property="og:image"       content="https://yoursite.com/preview.png">
<meta property="og:url"         content="https://yoursite.com">
```

---

## 🛠️ Local Development

```bash
# Option 1: VS Code Live Server (recommended)
# Install "Live Server" extension by Ritwick Dey
# Right-click index.html → Open with Live Server

# Option 2: Python simple server
python -m http.server 3000
# Open http://localhost:3000

# Option 3: Node.js
npx serve .
# Open http://localhost:3000
```

> **Important:** Firebase Google Sign-In requires a proper server (http:// or https://).  
> Double-clicking files (`file://`) will work for guest mode only.  
> Use Live Server or any of the above for full Firebase testing locally.

---

## 📊 Monitoring Your Live App

After deploying, monitor your usage:
- **Firebase Console** → Authentication → Users (see who signed up)
- **Firebase Console** → Firestore → Data (see stored user data)
- **Firebase Console** → Usage (track reads/writes against free tier limits)
- **Netlify/Vercel Dashboard** → Analytics (see traffic)

### Free Tier Limits (Firebase Spark Plan)
| Resource             | Limit             |
|----------------------|-------------------|
| Authentication users | Unlimited         |
| Firestore reads      | 50,000 / day      |
| Firestore writes     | 20,000 / day      |
| Firestore storage    | 1 GB              |

For a college project or personal use, you will never hit these limits.

---

## ❓ Troubleshooting

| Problem | Solution |
|---|---|
| `auth/unauthorized-domain` | Add domain in Firebase Auth → Settings → Authorised domains |
| Sign-in popup blocked | Allow popups for your domain in browser settings |
| CSS not loading | Ensure `css/app.css` path is correct relative to `app.html` |
| JS not loading | Open browser console (F12) → check for 404 errors on JS files |
| `app.html` not found from `index.html` | Both files must be in the same folder |
| Charts not rendering | Check Chart.js CDN loads (requires internet) |
| Data not syncing | Check Firestore rules allow authenticated writes |

---

## 📞 Support

If you encounter issues:
1. Open browser DevTools (F12) → Console tab → check for error messages
2. Check [Firebase Status](https://status.firebase.google.com) for outages
3. Open an issue on [GitHub](https://github.com/yourusername/habitos/issues)
