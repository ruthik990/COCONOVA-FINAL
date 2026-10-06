// ============================================================
// COCONOVE FIREBASE CONFIGURATION
// ============================================================

// Firebase App
import { initializeApp } from "firebase/app";

// Firebase Authentication
import { getAuth } from "firebase/auth";

// Cloud Firestore
import { getFirestore } from "firebase/firestore";

// Firebase Storage
import { getStorage } from "firebase/storage";

// Google Analytics
import { getAnalytics, isSupported } from "firebase/analytics";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyDUMqeeNH4b_udT89v10KrHaEvC5jDUrq0",
    authDomain: "coconova-7b685.firebaseapp.com",
    projectId: "coconova-7b685",
    storageBucket: "coconova-7b685.firebasestorage.app",
    messagingSenderId: "1074725496904",
    appId: "1:1074725496904:web:b291f763adfa246ad7107d",
    measurementId: "G-LMCGZDZ3CN"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);


// ============================================================
// FIREBASE SERVICES
// ============================================================

// Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

// Storage
const storage = getStorage(app);


// ============================================================
// ANALYTICS
// ============================================================

let analytics = null;

isSupported()
    .then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    })
    .catch((error) => {
        console.warn("Firebase Analytics unavailable:", error);
    });


// ============================================================
// EXPORT EVERYTHING
// ============================================================

export {
    app,
    auth,
    db,
    storage,
    analytics
};
