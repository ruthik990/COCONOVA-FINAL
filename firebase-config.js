
// ============================================================
// COCONOVE — FIREBASE CONFIGURATION
// Project: ocono-1940a
// Firebase SDK: 12.18.0
// ============================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import { getStorage } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";

import {
    getAnalytics,
    isSupported
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlhOpAJViV86gz0QAPXz-_ElCRGnA5Dw8",
    authDomain: "ocono-1940a.firebaseapp.com",
    projectId: "ocono-1940a",
    storageBucket: "ocono-1940a.firebasestorage.app",
    messagingSenderId: "431957031511",
    appId: "1:431957031511:web:919389c9577d3e0ce34112",
    measurementId: "G-QZXHG4Y9BB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics
let analytics = null;

const analyticsReady = isSupported()
    .then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
        return analytics;
    })
    .catch((error) => {
        console.warn("Analytics unavailable:", error);
        return null;
    });

// Export services
export {
    app,
    auth,
    db,
    storage,
    analytics,
    analyticsReady
};