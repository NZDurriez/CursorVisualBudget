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
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import {
    discordConfig,
    firebaseConfig,
    getDiscordFunctionUrl,
    isAdminEmail,
    isDiscordConfigured,
    isFirebaseConfigured
} from "./firebase-config.js";


const SAVE_DEBOUNCE_MS = 450;
const HEARTBEAT_MS = 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const ADMIN_ONLINE_MS = 10 * 60 * 1000;
const ADMIN_RECENT_MS = 7 * DAY_MS;
const ADMIN_NEW_MS = 7 * DAY_MS;
const DISCORD_OAUTH_STATE = "budget_discord_oauth";
const GOOGLE_OAUTH_PENDING = "budget_google_oauth";


let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let currentUser = null;
let saveTimer = null;
let heartbeatTimer = null;
let heartbeatListenersBound = false;
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


function userDirectoryRef(uid) {

    return doc(db, "userDirectory", uid);

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

            if (currentUser) {

                upsertUserDirectory({
                    touchFirstSeen: true
                }).catch(error => {

                    console.warn(
                        "[BudgetCloud] Directory update failed:",
                        error
                    );

                }).finally(() => {

                    if (currentUser) {

                        startPresenceHeartbeat();

                    }

                });

            } else {

                stopPresenceHeartbeat();

            }

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

    const adminNavBtn =
        document.getElementById("adminNavBtn");

    const isAdmin = isCurrentUserAdmin();

    if (adminNavBtn) {

        adminNavBtn.hidden = !isAdmin;

    }

    document.body.classList.toggle("is-admin", isAdmin);

    const adminPage =
        document.getElementById("admin");

    if (
        !isAdmin &&
        adminPage &&
        adminPage.classList.contains("active") &&
        typeof window.showBudgetPage === "function"
    ) {

        window.showBudgetPage("dashboard");

    }


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

    stopPresenceHeartbeat();

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

    try {

        await upsertUserDirectory({
            touchFirstSeen: true,
            usage: usageFromStorageData(storageData)
        });

    } catch (error) {

        console.warn(
            "[BudgetCloud] Directory update failed:",
            error
        );

    }

}


function usageCountsFromProfiles(profiles) {

    const list = Array.isArray(profiles) ? profiles : [];

    let incomeCount = 0;
    let paymentCount = 0;
    let oneOffCount = 0;

    list.forEach(profile => {

        const budget =
            profile && profile.budget
                ? profile.budget
                : {};

        incomeCount += Array.isArray(budget.income)
            ? budget.income.length
            : 0;

        paymentCount += Array.isArray(budget.payments)
            ? budget.payments.length
            : 0;

        oneOffCount += Array.isArray(budget.oneOffPayments)
            ? budget.oneOffPayments.length
            : 0;

    });

    return {
        profileCount: list.length,
        incomeCount,
        paymentCount,
        oneOffCount
    };

}


function usageFromStorageData(storageData) {

    return {
        ...usageCountsFromProfiles(
            storageData && storageData.profiles
        ),
        lastSave: serverTimestamp()
    };

}


function directoryIdentityPayload() {

    return {
        uid: currentUser.uid,
        email: currentUser.email || "",
        displayName: currentUser.displayName || "",
        photoURL: currentUser.photoURL || "",
        authProvider: getAuthProviderLabel(currentUser)
    };

}


function onPresenceVisibilityChange() {

    if (!document.hidden) {

        pingPresence();

    }

}


function startPresenceHeartbeat() {

    stopPresenceHeartbeat(false);

    pingPresence();

    heartbeatTimer = setInterval(
        pingPresence,
        HEARTBEAT_MS
    );

    if (!heartbeatListenersBound) {

        document.addEventListener(
            "visibilitychange",
            onPresenceVisibilityChange
        );

        heartbeatListenersBound = true;

    }

}


function stopPresenceHeartbeat(unbind) {

    if (heartbeatTimer) {

        clearInterval(heartbeatTimer);

        heartbeatTimer = null;

    }

    if (unbind !== false && heartbeatListenersBound) {

        document.removeEventListener(
            "visibilitychange",
            onPresenceVisibilityChange
        );

        heartbeatListenersBound = false;

    }

}


function pingPresence() {

    if (!currentUser || !db || document.hidden) {

        return;

    }

    upsertUserDirectory({ heartbeat: true }).catch(error => {

        console.warn(
            "[BudgetCloud] Presence heartbeat failed:",
            error
        );

    });

}


async function upsertUserDirectory(options) {

    if (!currentUser || !db) {

        return;

    }

    const settings = options || {};

    const payload = directoryIdentityPayload();

    payload.lastSeen = serverTimestamp();

    if (settings.usage) {

        Object.assign(payload, settings.usage);

    }

    if (settings.touchFirstSeen && !settings.heartbeat) {

        const snap =
            await getDoc(userDirectoryRef(currentUser.uid));

        if (!snap.exists()) {

            payload.firstSeen = serverTimestamp();

        }

    }

    await setDoc(
        userDirectoryRef(currentUser.uid),
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


function isCurrentUserAdmin() {

    return Boolean(
        currentUser &&
        currentUser.emailVerified &&
        isAdminEmail(currentUser.email)
    );

}


function firestoreTimestampToDate(value) {

    if (!value) {

        return null;

    }

    if (typeof value.toDate === "function") {

        return value.toDate();

    }

    if (value instanceof Date) {

        return value;

    }

    return null;

}


function toIsoOrNull(value) {

    const date = firestoreTimestampToDate(value);

    return date ? date.toISOString() : null;

}


function asCount(value) {

    const count = Number(value);

    return Number.isFinite(count) ? count : 0;

}


function pickNewerIso(left, right) {

    if (!left) {

        return right || null;

    }

    if (!right) {

        return left;

    }

    return left > right ? left : right;

}


function usageFieldsFromData(data) {

    const counts = usageCountsFromProfiles(data.profiles);

    const lastSave =
        toIsoOrNull(data.lastSave) ||
        toIsoOrNull(data.updatedAt);

    return {
        firstSeen: toIsoOrNull(data.firstSeen),
        lastSave,
        profileCount: asCount(
            data.profileCount !== undefined
                ? data.profileCount
                : counts.profileCount
        ),
        incomeCount: asCount(
            data.incomeCount !== undefined
                ? data.incomeCount
                : counts.incomeCount
        ),
        paymentCount: asCount(
            data.paymentCount !== undefined
                ? data.paymentCount
                : counts.paymentCount
        ),
        oneOffCount: asCount(
            data.oneOffCount !== undefined
                ? data.oneOffCount
                : counts.oneOffCount
        )
    };

}


function identityFromDirectoryDoc(entry, currentUid) {

    const data = entry.data() || {};

    return {
        uid: data.uid || entry.id,
        email: data.email || "",
        displayName: data.displayName || "",
        photoURL: data.photoURL || "",
        authProvider: data.authProvider || "",
        lastSeen: toIsoOrNull(data.lastSeen),
        isCurrentUser: entry.id === currentUid,
        hasUsage:
            data.profileCount !== undefined ||
            data.incomeCount !== undefined,
        ...usageFieldsFromData(data)
    };

}


function identityFromUserDoc(entry, currentUid) {

    const data = entry.data() || {};

    const counts = usageCountsFromProfiles(data.profiles);

    const lastActivity =
        toIsoOrNull(data.lastSeen) ||
        toIsoOrNull(data.updatedAt);

    return {
        uid: data.uid || entry.id,
        email: data.email || "",
        displayName: data.displayName || "",
        photoURL: data.photoURL || "",
        authProvider: data.authProvider || "",
        lastSeen: lastActivity,
        firstSeen: toIsoOrNull(data.firstSeen),
        lastSave: toIsoOrNull(data.updatedAt),
        profileCount: counts.profileCount,
        incomeCount: counts.incomeCount,
        paymentCount: counts.paymentCount,
        oneOffCount: counts.oneOffCount,
        isCurrentUser: entry.id === currentUid
    };

}


function mergeUserIdentity(primary, extra) {

    return {
        uid: primary.uid || extra.uid,
        email: primary.email || extra.email,
        displayName:
            primary.displayName || extra.displayName,
        photoURL: primary.photoURL || extra.photoURL,
        authProvider:
            primary.authProvider || extra.authProvider,
        lastSeen: pickNewerIso(
            primary.lastSeen,
            extra.lastSeen
        ),
        firstSeen: primary.firstSeen || extra.firstSeen,
        lastSave: pickNewerIso(
            primary.lastSave,
            extra.lastSave
        ),
        profileCount:
            typeof extra.profileCount === "number"
                ? extra.profileCount
                : asCount(primary.profileCount),
        incomeCount:
            typeof extra.incomeCount === "number"
                ? extra.incomeCount
                : asCount(primary.incomeCount),
        paymentCount:
            typeof extra.paymentCount === "number"
                ? extra.paymentCount
                : asCount(primary.paymentCount),
        oneOffCount:
            typeof extra.oneOffCount === "number"
                ? extra.oneOffCount
                : asCount(primary.oneOffCount),
        isCurrentUser:
            primary.isCurrentUser || extra.isCurrentUser
    };

}


function isWithinMs(iso, ms) {

    if (!iso) {

        return false;

    }

    const time = new Date(iso).getTime();

    if (Number.isNaN(time)) {

        return false;

    }

    return Date.now() - time <= ms;

}


function isRecentlySeen(iso) {

    return isWithinMs(iso, ADMIN_ONLINE_MS);

}


function isNeverCameBackUser(user) {

    if (!user.firstSeen || !user.lastSeen) {

        return false;

    }

    const first = new Date(user.firstSeen).getTime();
    const last = new Date(user.lastSeen).getTime();

    if (Number.isNaN(first) || Number.isNaN(last)) {

        return false;

    }

    return (
        last - first <= DAY_MS &&
        Date.now() - last > DAY_MS
    );

}


async function backfillDirectoryUsers(users) {

    await Promise.all(
        users.map(user => {

            const payload = {
                uid: user.uid,
                email: user.email || "",
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                authProvider: user.authProvider || "",
                profileCount: asCount(user.profileCount),
                incomeCount: asCount(user.incomeCount),
                paymentCount: asCount(user.paymentCount),
                oneOffCount: asCount(user.oneOffCount)
            };

            if (user.lastSeen) {

                payload.lastSeen = new Date(user.lastSeen);

            }

            if (user.lastSave) {

                payload.lastSave = new Date(user.lastSave);

            }

            return setDoc(
                userDirectoryRef(user.uid),
                payload,
                { merge: true }
            ).catch(error => {

                console.warn(
                    "[BudgetCloud] Directory backfill failed:",
                    user.uid,
                    error
                );

            });

        })
    );

}


async function listDirectoryUsers() {

    if (!db) {

        throw new Error("Firebase is not configured.");

    }

    if (!isCurrentUserAdmin()) {

        throw new Error("Admin access required.");

    }

    const currentUid =
        currentUser && currentUser.uid;

    const directorySnap =
        await getDocs(collection(db, "userDirectory"));

    const byUid = new Map();

    directorySnap.docs.forEach(entry => {

        const identity =
            identityFromDirectoryDoc(entry, currentUid);

        byUid.set(identity.uid, identity);

    });

    let listedExistingAccounts = false;

    try {

        const usersSnap =
            await getDocs(collection(db, "users"));

        listedExistingAccounts = true;

        const missing = [];

        usersSnap.docs.forEach(entry => {

            const identity =
                identityFromUserDoc(entry, currentUid);

            const existing = byUid.get(identity.uid);

            if (existing) {

                const merged =
                    mergeUserIdentity(existing, identity);

                byUid.set(identity.uid, merged);

                if (!existing.hasUsage) {

                    missing.push(merged);

                }

            } else {

                byUid.set(identity.uid, identity);

                missing.push(identity);

            }

        });

        if (missing.length > 0) {

            await backfillDirectoryUsers(missing);

        }

    } catch (error) {

        console.warn(
            "[BudgetCloud] Could not list existing users:",
            error
        );

        if (byUid.size === 0) {

            throw error;

        }

    }

    const users = Array.from(byUid.values()).map(user => {

        return {
            ...user,
            isOnline: isRecentlySeen(user.lastSeen),
            isRecentlyActive: isWithinMs(
                user.lastSeen,
                ADMIN_RECENT_MS
            ),
            isNeverCameBack: isNeverCameBackUser(user),
            isNewThisWeek: isWithinMs(
                user.firstSeen,
                ADMIN_NEW_MS
            ),
            listedExistingAccounts
        };

    });

    users.sort((a, b) => {

        if (a.isOnline !== b.isOnline) {

            return a.isOnline ? -1 : 1;

        }

        const aTime = a.lastSeen || "";
        const bTime = b.lastSeen || "";

        if (aTime !== bTime) {

            return bTime.localeCompare(aTime);

        }

        const aName =
            (a.displayName || a.email || a.uid).toLowerCase();

        const bName =
            (b.displayName || b.email || b.uid).toLowerCase();

        return aName.localeCompare(bName);

    });

    return users;

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
    isCurrentUserAdmin,
    getUser,
    queueSave,
    saveNow,
    loadUserData,
    listDirectoryUsers,
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
