// ============================================================
// Firebase web config
// ------------------------------------------------------------
// 1. Create a Firebase project (https://console.firebase.google.com)
// 2. Enable Authentication → Google sign-in
// 3. Create a Firestore database
// 4. Project settings → Your apps → Web app → copy config
// 5. Paste values below and set enabled: true
// 6. Deploy firestore.rules (see README)
//
// Discord login is planned for a later phase (custom OAuth).
// ============================================================

export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

/** Flip to true once the config above is filled in. */
export const firebaseEnabled = false;

export function isFirebaseConfigured() {

    if (!firebaseEnabled) {

        return false;

    }

    return Boolean(
        firebaseConfig.apiKey &&
        firebaseConfig.apiKey !== "YOUR_API_KEY" &&
        firebaseConfig.projectId &&
        firebaseConfig.projectId !== "YOUR_PROJECT_ID" &&
        firebaseConfig.appId &&
        firebaseConfig.appId !== "YOUR_APP_ID"
    );

}
