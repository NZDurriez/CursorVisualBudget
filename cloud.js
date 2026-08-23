// ============================================================
// Cloud layer — Firebase Auth (Google + Discord) + Firestore
// Guest / unconfigured mode keeps using localStorage only.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
    getAuth,
    getRedirectResult,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCustomToken,
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
    doc,
    getDoc,
    getFirestore,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import {
    discordConfig,
    firebaseConfig,
    getDiscordFunctionUrl,
    isDiscordConfigured,
    isFirebaseConfigured
} from "./firebase-config.js";


const SAVE_DEBOUNCE_MS = 450;
const DISCORD_OAUTH_STATE = "budget_discord_oauth";
const GOOGLE_OAUTH_PENDING = "budget_google_oauth";


let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let currentUser = null;
let saveTimer = null;
let readyResolve;
let authReadyResolve;

const readyPromise = new Promise(resolve => {

    readyResolve = resolve;

});

const authReadyPromise = new Promise(resolve => {

    authReadyResolve = resolve;

});


function userDocRef(uid) {

    return doc(db, "users", uid);

}


function getAuthProviderLabel(user) {

    if (!user) {

        return "";

    }

    if (
        String(user.uid || "").startsWith("discord:")
    ) {

        return "Discord";

    }

    return "Google";

}


function getDiscordRedirectUri() {

    // Must match an exact Redirect URL in the Discord developer portal
    const url = new URL(window.location.href);

    return `${url.origin}${url.pathname}`;

}


async function initFirebase() {

    if (!isFirebaseConfigured()) {

        console.info(
            "[BudgetCloud] Firebase not configured — guest/local mode only."
        );

        readyResolve();

        authReadyResolve();

        return;

    }


    try {

        app = initializeApp(firebaseConfig);

        auth = getAuth(app);

        db = getFirestore(app);

        googleProvider = new GoogleAuthProvider();

        googleProvider.setCustomParameters({
            prompt: "select_account"
        });


        onAuthStateChanged(auth, async user => {

            currentUser = user || null;

            updateAuthUi();

            if (typeof window.onBudgetAuthChanged === "function") {

                try {

                    await window.onBudgetAuthChanged(currentUser);

                } catch (error) {

                    console.error(
                        "[BudgetCloud] onBudgetAuthChanged failed:",
                        error
                    );

                }

            }

            authReadyResolve();

        });


        readyResolve();

        console.info("[BudgetCloud] Firebase ready.");


        // Finish Google / Discord OAuth redirects if the tab just came back
        await finishGoogleRedirect();

        await handleDiscordRedirectCallback();

    } catch (error) {

        console.error("[BudgetCloud] Init failed:", error);

        readyResolve();

        authReadyResolve();

    }

}


function updateAuthUi() {

    const root =
        document.getElementById("authPanel");

    if (!root) {

        return;

    }


    const configured = isFirebaseConfigured();

    const discordReady = isDiscordConfigured();

    const signedIn = Boolean(currentUser);


    root.hidden = false;

    root.classList.toggle("is-configured", configured);

    root.classList.toggle("is-signed-in", signedIn);


    const status =
        root.querySelector("[data-auth-status]");

    const nameEl =
        root.querySelector("[data-auth-name]");

    const avatar =
        root.querySelector("[data-auth-avatar]");

    const googleBtn =
        document.getElementById("googleSignInBtn");

    const discordBtn =
        document.getElementById("discordSignInBtn");

    const signOutBtn =
        document.getElementById("googleSignOutBtn");


    if (!configured) {

        if (status) {

            status.textContent =
                "Cloud sync off — add Firebase config to enable login.";

        }

        if (nameEl) {

            nameEl.textContent = "Guest (local only)";

        }

        if (avatar) {

            avatar.hidden = true;

        }

        if (googleBtn) {

            googleBtn.hidden = true;

        }

        if (discordBtn) {

            discordBtn.hidden = true;

        }

        if (signOutBtn) {

            signOutBtn.hidden = true;

        }

        return;

    }


    if (signedIn) {

        const providerLabel =
            getAuthProviderLabel(currentUser);

        if (status) {

            status.textContent =
                `Synced via ${providerLabel}`;

        }

        if (nameEl) {

            nameEl.textContent =
                currentUser.displayName ||
                currentUser.email ||
                "Signed in";

        }

        if (avatar) {

            if (currentUser.photoURL) {

                avatar.src = currentUser.photoURL;

                avatar.hidden = false;

            } else {

                avatar.hidden = true;

            }

        }

        if (googleBtn) {

            googleBtn.hidden = true;

            googleBtn.disabled = false;

            const googleLabel =
                googleBtn.querySelector(".nav-label");

            if (googleLabel) {

                googleLabel.textContent = "Sign in with Google";

            }

        }

        if (discordBtn) {

            discordBtn.hidden = true;

        }

        if (signOutBtn) {

            signOutBtn.hidden = false;

        }

    } else {

        const googlePending =
            isGoogleRedirectPending();

        if (status) {

            status.textContent = googlePending
                ? "Waiting for Google…"
                : "Sign in to sync budgets across devices";

        }

        if (nameEl) {

            nameEl.textContent = "Guest (this device)";

        }

        if (avatar) {

            avatar.hidden = true;

        }

        if (googleBtn) {

            googleBtn.hidden = false;

            googleBtn.disabled = googlePending;

            const googleLabel =
                googleBtn.querySelector(".nav-label");

            if (googleLabel) {

                googleLabel.textContent = googlePending
                    ? "Waiting for Google…"
                    : "Sign in with Google";

            }

        }

        if (discordBtn) {

            // Show the button even before Discord is fully configured
            // so users know it's coming; click explains setup if needed.
            discordBtn.hidden = false;

            discordBtn.disabled = false;

            discordBtn.title = discordReady
                ? "Sign in with Discord"
                : "Discord setup still needed (see README)";

        }

        if (signOutBtn) {

            signOutBtn.hidden = true;

        }

    }

}


function isGoogleRedirectPending() {

    try {

        return sessionStorage.getItem(GOOGLE_OAUTH_PENDING) === "1";

    } catch (error) {

        return false;

    }

}


function setGoogleRedirectPending(pending) {

    try {

        if (pending) {

            sessionStorage.setItem(GOOGLE_OAUTH_PENDING, "1");

        } else {

            sessionStorage.removeItem(GOOGLE_OAUTH_PENDING);

        }

    } catch (error) {

        // Private mode can block sessionStorage; sign-in can still proceed.

    }

}


function isAuthCancelled(error) {

    const code = String(error?.code || "");

    return (
        code.includes("cancel") ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/popup-blocked"
    );

}


function showGoogleSignInError(error) {

    console.error("[BudgetCloud] Google sign-in failed:", error);

    if (isAuthCancelled(error)) {

        return;

    }

    alert(
        error?.message ||
        "Google sign-in failed. Check the console for details."
    );

}


async function signInWithGoogle() {

    if (!auth || !googleProvider) {

        alert(
            "Firebase is not configured yet."
        );

        return;

    }


    try {

        // Popup is required on GitHub Pages. Firebase's same-window
        // redirect stores the session on firebaseapp.com, and browsers
        // block budgio.nz from reading it — so you come back still a guest.
        setGoogleRedirectPending(true);

        updateAuthUi();

        await signInWithPopup(auth, googleProvider);

    } catch (error) {

        showGoogleSignInError(error);

    } finally {

        setGoogleRedirectPending(false);

        updateAuthUi();

    }

}


async function finishGoogleRedirect() {

    if (!auth) {

        return;

    }


    try {

        await getRedirectResult(auth);

    } catch (error) {

        showGoogleSignInError(error);

    } finally {

        setGoogleRedirectPending(false);

        updateAuthUi();

    }

}


function beginDiscordSignIn() {

    if (!isFirebaseConfigured()) {

        alert("Firebase is not configured yet.");

        return;

    }


    if (!isDiscordConfigured()) {

        alert(
            "Discord sign-in is not fully enabled yet.\n\n" +
            "1) Create a Discord application and paste the Client ID into firebase-config.js\n" +
            "2) Set discordConfig.enabled = true\n" +
            "3) Deploy the exchangeDiscordCode Cloud Function (see README)\n\n" +
            "Google sign-in still works in the meantime."
        );

        return;

    }


    const redirectUri = getDiscordRedirectUri();

    sessionStorage.setItem(
        DISCORD_OAUTH_STATE,
        "1"
    );

    sessionStorage.setItem(
        "budget_discord_redirect_uri",
        redirectUri
    );


    const params = new URLSearchParams({
        client_id: discordConfig.clientId,
        response_type: "code",
        scope: "identify email",
        redirect_uri: redirectUri,
        state: DISCORD_OAUTH_STATE,
        prompt: "consent"
    });


    window.location.href =
        `https://discord.com/api/oauth2/authorize?${params.toString()}`;

}


async function handleDiscordRedirectCallback() {

    const params =
        new URLSearchParams(window.location.search);

    const code = params.get("code");

    const state = params.get("state");

    const oauthError = params.get("error");


    if (oauthError) {

        cleanupDiscordQueryParams();

        alert(
            "Discord sign-in was cancelled or failed."
        );

        return;

    }


    if (
        !code ||
        state !== DISCORD_OAUTH_STATE
    ) {

        return;

    }


    if (!auth) {

        return;

    }


    const expected =
        sessionStorage.getItem(DISCORD_OAUTH_STATE);


    if (expected !== "1") {

        cleanupDiscordQueryParams();

        return;

    }


    const redirectUri =
        sessionStorage.getItem("budget_discord_redirect_uri") ||
        getDiscordRedirectUri();


    try {

        const response = await fetch(
            getDiscordFunctionUrl(),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code,
                    redirectUri
                })
            }
        );


        const payload = await response.json();


        if (!response.ok || !payload.token) {

            throw new Error(
                payload.error ||
                "Discord sign-in failed"
            );

        }


        await signInWithCustomToken(
            auth,
            payload.token
        );


        sessionStorage.removeItem(DISCORD_OAUTH_STATE);

        sessionStorage.removeItem(
            "budget_discord_redirect_uri"
        );


        cleanupDiscordQueryParams();

    } catch (error) {

        console.error(
            "[BudgetCloud] Discord callback failed:",
            error
        );

        cleanupDiscordQueryParams();

        alert(
            error?.message ||
            "Discord sign-in failed. Is the Cloud Function deployed?"
        );

    }

}


function cleanupDiscordQueryParams() {

    const url = new URL(window.location.href);

    url.searchParams.delete("code");

    url.searchParams.delete("state");

    url.searchParams.delete("error");

    url.searchParams.delete("error_description");

    window.history.replaceState(
        {},
        document.title,
        `${url.pathname}${url.search}${url.hash}`
    );

}


async function signOutUser() {

    if (!auth) {

        return;

    }


    try {

        await signOut(auth);

    } catch (error) {

        console.error("[BudgetCloud] Sign-out failed:", error);

    }

}


function queueSave(storageData) {

    if (!currentUser || !db) {

        return;

    }


    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {

        saveNow(storageData).catch(error => {

            console.error(
                "[BudgetCloud] Save failed:",
                error
            );

        });

    }, SAVE_DEBOUNCE_MS);

}


async function saveNow(storageData) {

    if (!currentUser || !db) {

        return;

    }


    const payload = {
        activeProfileId:
            storageData.activeProfileId || null,
        profiles:
            Array.isArray(storageData.profiles)
                ? storageData.profiles
                : [],
        updatedAt: serverTimestamp(),
        email: currentUser.email || "",
        displayName: currentUser.displayName || "",
        authProvider: getAuthProviderLabel(currentUser)
    };


    await setDoc(
        userDocRef(currentUser.uid),
        payload,
        { merge: true }
    );

}


async function loadUserData() {

    if (!currentUser || !db) {

        return null;

    }


    const snap =
        await getDoc(userDocRef(currentUser.uid));


    if (!snap.exists()) {

        return null;

    }


    const data = snap.data() || {};


    if (!Array.isArray(data.profiles)) {

        return null;

    }


    return {
        activeProfileId: data.activeProfileId || null,
        profiles: data.profiles
    };

}


function isSignedIn() {

    return Boolean(currentUser);

}


function getUser() {

    return currentUser;

}


function setupAuthButtons() {

    const googleBtn =
        document.getElementById("googleSignInBtn");

    const discordBtn =
        document.getElementById("discordSignInBtn");

    const signOutBtn =
        document.getElementById("googleSignOutBtn");


    if (googleBtn) {

        googleBtn.addEventListener(
            "click",
            () => {

                signInWithGoogle();

            }
        );

    }


    if (discordBtn) {

        discordBtn.addEventListener(
            "click",
            () => {

                beginDiscordSignIn();

            }
        );

    }


    if (signOutBtn) {

        signOutBtn.addEventListener(
            "click",
            () => {

                signOutUser();

            }
        );

    }


    updateAuthUi();

}


window.BudgetCloud = {
    ready: readyPromise,
    authReady: authReadyPromise,
    isConfigured: isFirebaseConfigured,
    isDiscordConfigured,
    isSignedIn,
    getUser,
    queueSave,
    saveNow,
    loadUserData,
    signInWithGoogle,
    beginDiscordSignIn,
    signOutUser,
    refreshAuthUi: updateAuthUi
};


window.BudgetCloudReady = readyPromise;


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            setupAuthButtons();

            initFirebase();

        }
    );

} else {

    setupAuthButtons();

    initFirebase();

}
