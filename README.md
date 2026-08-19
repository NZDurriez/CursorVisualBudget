# CursorVisualBudget

NZ personal budget dashboard (local-first, with optional Firebase sync).

## Features

- Dashboard, income, recurring / one-off payments, savings goals, NZ pay calculator, calendar
- Profiles + light/dark mode
- **Guest mode:** data stays in `localStorage` on this device
- **Google sign-in:** sync budget data to Firestore
- **Discord sign-in:** same sync via Discord OAuth + Cloud Function (optional setup)

## Firebase setup (Google login)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. **Authentication → Sign-in method → Google → Enable**
3. Create a **Firestore** database and publish `firestore.rules`
4. Register a **Web** app and put the config in `firebase-config.js` (`firebaseEnabled = true`)
5. Add authorized domains (`localhost`, `nzdurriez.github.io`, etc.)

### What happens on first sign-in

- If Firestore has no data for you yet, your **local** budget is uploaded
- If cloud data already exists, it loads into the app (and caches locally)

## Discord sign-in setup

Discord is **not** a built-in Firebase provider. This project uses:

1. Discord OAuth on the website  
2. A Cloud Function that exchanges the code and mints a **Firebase custom token**  
3. `signInWithCustomToken` in the browser  

### Important

- **Google and Discord are separate cloud accounts** (different Firebase UIDs), so budgets do not auto-merge between them yet.
- Cloud Functions need the Firebase **Blaze** plan (pay-as-you-go; free usage allowance is usually enough for personal apps).
- Never put the Discord **Client Secret** in frontend code.

### A) Create a Discord application

1. Open [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**
2. **OAuth2 → General**
3. Copy **Client ID**
4. Copy **Client Secret** (keep private)
5. Under **Redirects**, add exactly (include trailing slash if your site uses it):

```text
https://nzdurriez.github.io/CursorVisualBudget/
```

Also add local testing if needed, e.g. `http://localhost:5500/` (must match the browser URL exactly).

### B) Put Client ID in the website config

Edit `firebase-config.js`:

```js
export const discordConfig = {
    enabled: true,
    clientId: "YOUR_REAL_DISCORD_CLIENT_ID",
    functionUrl: "" // leave blank unless you customize the function URL
};
```

### C) Deploy the Cloud Function

1. Upgrade the Firebase project to **Blaze** (required for Functions)
2. Install tools: Node 20+, [Firebase CLI](https://firebase.google.com/docs/cli)
3. From the repo root:

```bash
firebase login
firebase use visualbudget-8d771
cd functions
npm install
cd ..
firebase functions:config:set discord.client_id="YOUR_CLIENT_ID" discord.client_secret="YOUR_CLIENT_SECRET"
firebase deploy --only functions:exchangeDiscordCode
```

4. Confirm the function URL looks like:

```text
https://us-central1-visualbudget-8d771.cloudfunctions.net/exchangeDiscordCode
```

### D) Test

1. Hard-refresh the site  
2. **Sign in with Discord**  
3. Approve the Discord permissions  
4. You should return signed in; Firestore should show `users/discord:<id>`

## Local development

Use a real origin (`localhost`) and add it under **Authentication → Settings → Authorized domains**.  
Discord redirect URLs must match the exact page URL.

## Security

- Web Firebase config keys are public by design; **Firestore rules** enforce access
- Discord **Client Secret** only belongs in Cloud Function config / secrets
