# CursorVisualBudget

NZ personal budget dashboard (local-first, with optional Firebase sync).

## Features

- Dashboard, income, recurring / one-off payments, savings goals, NZ pay calculator, calendar
- Profiles + light/dark mode
- **Guest mode:** data stays in `localStorage` on this device
- **Google sign-in:** sync the same budget JSON to Firestore across devices

## Firebase setup (Google login)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. **Authentication → Sign-in method → Google → Enable**
3. Create a **Firestore** database and publish `firestore.rules`
4. Register a **Web** app and put the config in `firebase-config.js` (`firebaseEnabled = true`)
5. Add authorized domains (`localhost`, `budgio.nz`, etc.)

### What happens on first sign-in

- If Firestore has no data for you yet, your **local** budget is uploaded
- If cloud data already exists, it loads into the app (and caches locally)

## Discord login

Not enabled. Discord needs a Cloud Function (Firebase Blaze plan). Google sign-in is enough for cross-device sync.

## Local development

Open `index.html` via any static server (or your host).  
Google sign-in uses a **same-window redirect** (this tab goes to Google, then returns to the app). Add `localhost` and your live domain (`budgio.nz`) under **Authentication → Settings → Authorized domains**.

## Security

- Web config keys are public by design; **Firestore rules** enforce access
- Never put private secrets in frontend code
