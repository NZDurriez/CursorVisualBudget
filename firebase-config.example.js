// ============================================================
// Firebase web config EXAMPLE — copy values into firebase-config.js
// ============================================================

export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

export const firebaseEnabled = false;

export const discordConfig = {
    enabled: false,
    clientId: "YOUR_DISCORD_CLIENT_ID",
    functionUrl: ""
};

export function isFirebaseConfigured() {
    if (!firebaseEnabled) return false;
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
    if (discordConfig.functionUrl) return discordConfig.functionUrl;
    return `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/exchangeDiscordCode`;
}
