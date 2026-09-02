// ============================================================
// Firebase web config
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
 * Google / Discord emails that can open the Admin page and list
 * other signed-in users. Must stay in sync with isAdmin() in
 * firestore.rules — the rules are what actually grant access.
 */
export const adminEmails = [
    "alex.mangin35@gmail.com"
];

/**
 * Discord OAuth — not enabled.
 * Requires Blaze + Cloud Functions; left disabled on purpose.
 */
export const discordConfig = {
    enabled: false,
    clientId: "",
    functionUrl: ""
};

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

export function isAdminEmail(email) {

    if (!email) {

        return false;

    }

    const needle =
        String(email).trim().toLowerCase();

    return adminEmails.some(
        allowed =>
            String(allowed).trim().toLowerCase() ===
            needle
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
