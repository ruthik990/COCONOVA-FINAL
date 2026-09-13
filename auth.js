// ==========================================
// COCONOVA AUTHENTICATION
// ==========================================


// ==========================================
// IMPORT FIREBASE CONFIG
// ==========================================

import { auth, db } from "./firebase-config.js";


// ==========================================
// IMPORT FIREBASE AUTH FUNCTIONS
// ==========================================

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// ==========================================
// IMPORT FIRESTORE FUNCTIONS
// ==========================================

import {
    doc,
    setDoc,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==========================================
// GET ELEMENTS
// ==========================================

const signupForm =
    document.getElementById("signupForm");

const loginForm =
    document.getElementById("loginForm");

const authMessage =
    document.getElementById("authMessage");


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(message, type = "error") {

    if (!authMessage) return;


    authMessage.textContent = message;

    authMessage.className =
        `auth-message ${type}`;

}


// ==========================================
// REDIRECT FUNCTION
// ==========================================

function redirectUser() {

    const redirectPage =
        sessionStorage.getItem(
            "redirectAfterLogin"
        ) || "index.html";


    sessionStorage.removeItem(
        "redirectAfterLogin"
    );


    window.location.href =
        redirectPage;

}


// ==========================================
// SIGNUP
// ==========================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // GET USER DETAILS

            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            // VALIDATION

            if (!name) {

                showMessage(
                    "Please enter your full name."
                );

                return;

            }


            if (!email) {

                showMessage(
                    "Please enter your email."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            // GET BUTTON

            const button =
                signupForm.querySelector(
                    "button[type='submit']"
                );


            // DISABLE BUTTON

            button.disabled = true;

            button.textContent =
                "Creating Account...";


            try {

                // ======================================
                // CREATE FIREBASE AUTH USER
                // ======================================

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                // ======================================
                // UPDATE USER PROFILE
                // ======================================

                await updateProfile(
                    user,
                    {
                        displayName: name
                    }
                );


                // ======================================
                // CREATE USER DOCUMENT IN FIRESTORE
                // ======================================

                await setDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    ),
                    {

                        uid: user.uid,

                        name: name,

                        email: email,

                        role: "customer",

                        createdAt:
                            serverTimestamp()

                    }
                );


                // ======================================
                // SUCCESS MESSAGE
                // ======================================

                showMessage(
                    "Account created successfully!",
                    "success"
                );


                // ======================================
                // REDIRECT
                // ======================================

                setTimeout(
                    redirectUser,
                    1000
                );


            } catch (error) {

                console.error(
                    "Signup Error:",
                    error
                );


                let message =
                    "Something went wrong. Please try again.";


                // EMAIL ALREADY EXISTS

                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message =
                        "This email is already registered.";

                }


                // WEAK PASSWORD

                else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message =
                        "Password should contain at least 6 characters.";

                }


                // INVALID EMAIL

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Please enter a valid email address.";

                }


                // NETWORK ERROR

                else if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    message =
                        "Network error. Please check your internet connection.";

                }


                showMessage(
                    message,
                    "error"
                );


                // ENABLE BUTTON AGAIN

                button.disabled = false;

                button.textContent =
                    "Create Account";

            }

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // GET DETAILS

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            // GET BUTTON

            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );


            // DISABLE BUTTON

            button.disabled = true;

            button.textContent =
                "Logging In...";


            try {

                // ======================================
                // LOGIN USER
                // ======================================

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                // SUCCESS MESSAGE

                showMessage(
                    "Login successful!",
                    "success"
                );


                // REDIRECT

                setTimeout(
                    redirectUser,
                    700
                );


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                let message =
                    "Invalid email or password.";


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    message =
                        "Incorrect email or password.";

                }


                else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "No account found with this email.";

                }


                else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    message =
                        "Incorrect password.";

                }


                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Please enter a valid email address.";

                }


                else if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    message =
                        "Network error. Please check your internet connection.";

                }


                showMessage(
                    message,
                    "error"
                );


                // ENABLE BUTTON AGAIN

                button.disabled = false;

                button.textContent =
                    "Login";

            }

        }
    );

}


// ==========================================
// AUTH STATE CHECK
// ==========================================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            console.log(
                "Logged in user:",
                user.email
            );

        } else {

            console.log(
                "No user logged in"
            );

        }

    }
);