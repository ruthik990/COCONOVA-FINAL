// ============================================================
// COCONOVE - FIREBASE CONFIG
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAnalytics
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// CONFIG
// ============================================================

const firebaseConfig = {

    apiKey: "AIzaSyDiSySUw82aTMkLeyC-khhapzRoP2EI5iU",

    authDomain: "coconovs.firebaseapp.com",

    projectId: "coconovs",

    storageBucket: "coconovs.firebasestorage.app",

    messagingSenderId: "950557617874",

    appId: "1:950557617874:web:07105f0d188ef92bad470b",

    measurementId: "G-1CP4ZNXZEM"

};


// ============================================================
// INITIALIZE
// ============================================================

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================================
// EXPORT
// ============================================================

export {
    app,
    analytics,
    auth,
    db
};