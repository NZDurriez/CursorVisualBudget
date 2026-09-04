// ============================================================
// Firebase web config
// Web API keys are public by design. Access is enforced by
// Firestore rules, not by this file.
// ============================================================

export const firebaseConfig = {
    apiKey: "AIzaSyCslijgnLiSvfIRsYQ7DGcay_OPJ3j-AW0",
    authDomain: "visualbudget-8d771.firebaseapp.com",
    projectId: "visualbudget-8d771",
    storageBucket: "visualbudget-8d771.firebasestorage.app",
    messagingSenderId: "413073775534",
    appId: "1:413073775534:web:6cc5f7c5eaf86b15d9463f",
    measurementId: "G-F9E6RT1BZ1"
};

/** Flip to true once the Firebase config above is filled in. */
export const firebaseEnabled = true;

/**
 * Discord OAuth — not enabled.
 * Requires Blaze + Cloud Functions; left disabled on purpose.
 */
export const discordConfig = {
    enabled: false,
    clientId: "",
    functionUrl: ""
};

/**
 * Facebook sign-in button. Login still works for accounts
 * already signed in with Facebook; the sidebar button stays
 * hidden until Meta Advanced Access / Live is ready.
 */
export const facebookSignInEnabled = false;

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

export function isDiscordConfigured() {

    return Boolean(
        isFirebaseConfigured() &&
        discordConfig.enabled &&
        discordConfig.clientId &&
        discordConfig.clientId !== "YOUR_DISCORD_CLIENT_ID"
    );

}

export function getDiscordFunctionUrl() {

    if (discordConfig.functionUrl) {

        return discordConfig.functionUrl;

    }

    const projectId = firebaseConfig.projectId;

    return `https://us-central1-${projectId}.cloudfunctions.net/exchangeDiscordCode`;

}
