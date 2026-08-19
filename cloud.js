// ============================================================
// Cloud layer — Firebase Auth (Google) + Firestore
// Guest / unconfigured mode keeps using localStorage only.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
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
    firebaseConfig,
    isFirebaseConfigured
} from "./firebase-config.js";


const SAVE_DEBOUNCE_MS = 450;


let app = null;
let auth = null;
let db = null;
let provider = null;
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

        provider = new GoogleAuthProvider();

        provider.setCustomParameters({
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

    const signInBtn =
        document.getElementById("googleSignInBtn");

    const signOutBtn =
        document.getElementById("googleSignOutBtn");


    if (!configured) {

        if (status) {

            status.textContent =
                "Cloud sync off — add Firebase config to enable Google login.";

        }

        if (nameEl) {

            nameEl.textContent = "Guest (local only)";

        }

        if (avatar) {

            avatar.hidden = true;

        }

        if (signInBtn) {

            signInBtn.hidden = true;

        }

        if (signOutBtn) {

            signOutBtn.hidden = true;

        }

        return;

    }


    if (signedIn) {

        if (status) {

            status.textContent =
                "Synced to your Google account";

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

        if (signInBtn) {

            signInBtn.hidden = true;

        }

        if (signOutBtn) {

            signOutBtn.hidden = false;

        }

    } else {

        if (status) {

            status.textContent =
                "Sign in to sync budgets across devices";

        }

        if (nameEl) {

            nameEl.textContent = "Guest (this device)";

        }

        if (avatar) {

            avatar.hidden = true;

        }

        if (signInBtn) {

            signInBtn.hidden = false;

        }

        if (signOutBtn) {

            signOutBtn.hidden = true;

        }

    }

}


async function signInWithGoogle() {

    if (!auth || !provider) {

        alert(
            "Firebase is not configured yet. Add your project keys to firebase-config.js and set firebaseEnabled to true."
        );

        return;

    }


    try {

        await signInWithPopup(auth, provider);

    } catch (error) {

        console.error("[BudgetCloud] Sign-in failed:", error);

        alert(
            error?.message ||
            "Google sign-in failed. Check the console for details."
        );

    }

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
        displayName: currentUser.displayName || ""
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

    const signInBtn =
        document.getElementById("googleSignInBtn");

    const signOutBtn =
        document.getElementById("googleSignOutBtn");


    if (signInBtn) {

        signInBtn.addEventListener(
            "click",
            () => {

                signInWithGoogle();

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
    isSignedIn,
    getUser,
    queueSave,
    saveNow,
    loadUserData,
    signInWithGoogle,
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
