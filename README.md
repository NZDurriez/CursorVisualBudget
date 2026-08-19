# CursorVisualBudget

NZ personal budget dashboard (local-first, with optional Firebase sync).

## Features

- Dashboard, income, recurring / one-off payments, savings goals, NZ pay calculator, calendar
- Profiles + light/dark mode
- **Guest mode:** data stays in `localStorage` on this device
- **Optional Google sign-in:** sync the same budget JSON to Firestore

## Firebase setup (Google login)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. **Authentication → Sign-in method → Google → Enable**
3. **Build → Firestore Database → Create** (start in production mode, then use our rules)
4. **Project settings → Your apps → Web (`</>`)** → register app → copy the config object
5. Open `firebase-config.js`, paste your keys, set `firebaseEnabled = true`
6. Deploy rules (install [Firebase CLI](https://firebase.google.com/docs/cli) if needed):

```bash
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules
```

Or paste `firestore.rules` into **Firestore → Rules** and publish.

7. Hard-refresh the site → **Sign in with Google** in the sidebar

### What happens on first sign-in

- If Firestore has no data for you yet, your **local** budget is uploaded
- If cloud data already exists, it **replaces** the in-memory session (local is still kept as a cache write-through on save)

### Discord login

Not in this phase. Discord needs custom OAuth + a Cloud Function (or similar) to mint a Firebase custom token. Google-only for now.

## Local development

Open `index.html` via any static server (or your host).  
Firebase Auth popups need a real origin — add `localhost` (and your domain) under **Authentication → Settings → Authorized domains**.

## Security

- Web config keys are public by design; **Firestore rules** enforce access
- Never put Discord client secrets (or any private keys) in frontend code
