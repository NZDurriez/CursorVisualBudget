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
 * Discord OAuth (requires Cloud Function deploy — see README).
 * 1. Create an app at https://discord.com/developers/applications
 * 2. OAuth2 → redirect URL must match your site exactly, e.g.
 *    https://nzdurriez.github.io/CursorVisualBudget/
 * 3. Paste Client ID below, set enabled true after function is deployed
 * 4. Put Client Secret only in Cloud Function config (never here)
 */
export const discordConfig = {
    enabled: true,
    clientId: "1539746036103258212",
    // Leave empty to use: https://us-central1-<projectId>.cloudfunctions.net/exchangeDiscordCode
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
