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
Google sign-in uses a **popup** (required on GitHub Pages). A same-window redirect reaches Google, but browsers block the session from coming back to `budgio.nz`, so you land as a guest. Add `localhost` and your live domain (`budgio.nz`) under **Authentication → Settings → Authorized domains**.

## Security

- Web config keys are public by design; **Firestore rules** enforce access
- Never put private secrets or admin emails in frontend code
- Admin UI is shown only if Firebase Auth reports an `admin` claim, or if
  Firestore allows an admin-only directory read

## Admin panel

The Admin page lists signed-in users from `userDirectory` (identity and last seen). Usage counts stay in the directory for the Empty/Active filter; they are not shown as a table column. Budget JSON is not downloaded for the list.

**View as** loads one person’s budget into your session so you can look around. Edit and delete controls are hidden. Nothing is written to their account or yours; Exit restores your budget.

Filters cover activity, Empty vs Active, and Google/Discord. **New this week** counts first seen in the last 7 days.

1. Put your Google sign-in email in `isAdmin()` in `firestore.rules` (or set an Auth custom claim `admin: true`)
2. Deploy rules: `firebase deploy --only firestore:rules` (or paste the rules in Firebase Console → Firestore → Rules)

Guest (this device) sessions are not listed.
