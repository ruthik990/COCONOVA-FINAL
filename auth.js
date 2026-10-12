
/* =========================================================
   COCONOVA AUTHENTICATION
   Features:
   1. Customer registration
   2. Email verification
   3. Resend verification email
   4. Login with verified email only
   5. Forgot password
   6. Firebase Firestore customer profile
   ========================================================= */

import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   ELEMENTS
   ========================================================= */

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const authMessage = document.getElementById("authMessage");

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");

const resendVerificationBtn =
    document.getElementById("resendVerificationBtn");


/* =========================================================
   MESSAGE DISPLAY
   ========================================================= */

function showMessage(message, type = "error") {
    if (!authMessage) {
        alert(message);
        return;
    }

    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.style.display = "block";
}


/* =========================================================
   BUTTON HELPERS
   ========================================================= */

function setButtonLoading(button, loading, loadingText, normalText) {
    if (!button) return;

    button.disabled = loading;
    button.textContent = loading ? loadingText : normalText;
}


/* =========================================================
   REDIRECT AFTER LOGIN
   ========================================================= */

function redirectUser() {
    const redirectPage =
        sessionStorage.getItem("redirectAfterLogin") ||
        "index.html";

    sessionStorage.removeItem("redirectAfterLogin");

    window.location.href = redirectPage;
}


/* =========================================================
   SIGNUP
   Existing form IDs:
   signupForm, signupName, signupEmail, signupPassword
   ========================================================= */

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name =
            document.getElementById("signupName")?.value.trim() || "";

        const email =
            document.getElementById("signupEmail")?.value.trim() || "";

        const password =
            document.getElementById("signupPassword")?.value || "";

        const button =
            signupForm.querySelector("button[type='submit']");

        if (!name) {
            showMessage("Please enter your full name.");
            return;
        }

        if (!email) {
            showMessage("Please enter your email address.");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must contain at least 6 characters.");
            return;
        }

        setButtonLoading(
            button,
            true,
            "Creating Account...",
            "Create Account"
        );

        let createdUser = null;

        try {
            // 1. Create the Firebase Authentication account
            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            createdUser = credential.user;

            // 2. Save the customer's display name
            await updateProfile(createdUser, {
                displayName: name
            });

            // 3. Save the customer profile in Firestore
            await setDoc(
                doc(db, "users", createdUser.uid),
                {
                    uid: createdUser.uid,
                    name: name,
                    email: email,
                    role: "customer",
                    emailVerified: false,
                    createdAt: serverTimestamp()
                }
            );

            // 4. Send the verification email
            await sendEmailVerification(createdUser);

            // 5. Sign out until email verification is complete
            await signOut(auth);

            showMessage(
                "Account created! We sent a verification link to your email. Verify your email before logging in.",
                "success"
            );

            signupForm.reset();

        } catch (error) {
            console.error("Signup Error:", error);

            // If an account was created but a later operation
            // failed, do not silently pretend signup was complete.
            if (createdUser) {
                showMessage(
                    "Your account may have been created, but setup or verification email sending failed. Try logging in and resending the verification email.",
                    "error"
                );
            } else {
                const messages = {
                    "auth/email-already-in-use":
                        "This email is already registered. Please log in.",
                    "auth/invalid-email":
                        "Please enter a valid email address.",
                    "auth/weak-password":
                        "Your password must contain at least 6 characters.",
                    "auth/network-request-failed":
                        "Network error. Check your internet connection.",
                    "auth/operation-not-allowed":
                        "Email/Password sign-in is disabled in Firebase."
                };

                showMessage(
                    messages[error.code] ||
                    "Could not create your account. Please try again."
                );
            }

        } finally {
            setButtonLoading(
                button,
                false,
                "Creating Account...",
                "Create Account"
            );
        }
    });
}


/* =========================================================
   LOGIN
   Existing form IDs:
   loginForm, loginEmail, loginPassword
   ========================================================= */

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email =
            document.getElementById("loginEmail")?.value.trim() || "";

        const password =
            document.getElementById("loginPassword")?.value || "";

        const button =
            loginForm.querySelector("button[type='submit']");

        if (!email || !password) {
            showMessage("Enter your email and password.");
            return;
        }

        setButtonLoading(
            button,
            true,
            "Logging In...",
            "Login"
        );

        try {
            const credential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = credential.user;

            // Block access for unverified accounts
            if (!user.emailVerified) {
                try {
                    await sendEmailVerification(user);

                    showMessage(
                        "Your email is not verified. A new verification link has been sent. Check your inbox and spam folder.",
                        "error"
                    );
                } catch (verificationError) {
                    console.error(
                        "Resend Verification Error:",
                        verificationError
                    );

                    showMessage(
                        "Your email is not verified. We could not resend the email automatically. Use the Resend Verification option below.",
                        "error"
                    );
                }

                await signOut(auth);
                return;
            }

            showMessage("Login successful!", "success");

            setTimeout(redirectUser, 700);

        } catch (error) {
            console.error("Login Error:", error);

            const messages = {
                "auth/invalid-credential":
                    "Incorrect email or password.",
                "auth/user-not-found":
                    "No account found with this email.",
                "auth/wrong-password":
                    "Incorrect email or password.",
                "auth/invalid-email":
                    "Please enter a valid email address.",
                "auth/too-many-requests":
                    "Too many attempts. Please wait and try again.",
                "auth/network-request-failed":
                    "Network error. Check your internet connection."
            };

            showMessage(
                messages[error.code] ||
                "Login failed. Please check your details and try again."
            );

        } finally {
            setButtonLoading(
                button,
                false,
                "Logging In...",
                "Login"
            );
        }
    });
}


/* =========================================================
   FORGOT PASSWORD
   Add this link to login.html:
   <a href="#" id="forgotPasswordBtn">Forgot Password?</a>
   ========================================================= */

if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const email =
            document.getElementById("loginEmail")?.value.trim() || "";

        if (!email) {
            showMessage(
                "Enter your registered email in the email field first."
            );

            document.getElementById("loginEmail")?.focus();
            return;
        }

        forgotPasswordBtn.style.pointerEvents = "none";

        try {
            await sendPasswordResetEmail(auth, email);

            showMessage(
                "If an account exists for this email, a password-reset link has been sent. Check your inbox and spam folder.",
                "success"
            );

        } catch (error) {
            console.error("Password Reset Error:", error);

            if (error.code === "auth/invalid-email") {
                showMessage("Please enter a valid email address.");
            } else if (error.code === "auth/too-many-requests") {
                showMessage("Too many requests. Please wait and try again.");
            } else {
                showMessage(
                    "Unable to send the reset email. Please try again."
                );
            }

        } finally {
            forgotPasswordBtn.style.pointerEvents = "";
        }
    });
}


/* =========================================================
   RESEND VERIFICATION EMAIL
   Add this link to login.html:
   <a href="#" id="resendVerificationBtn">
       Resend Verification Email
   </a>

   The customer must enter their email and password first.
   ========================================================= */

if (resendVerificationBtn) {
    resendVerificationBtn.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();

            const email =
                document.getElementById("loginEmail")?.value.trim() || "";

            const password =
                document.getElementById("loginPassword")?.value || "";

            if (!email || !password) {
                showMessage(
                    "Enter your email and password, then click Resend Verification Email."
                );
                return;
            }

            resendVerificationBtn.style.pointerEvents = "none";

            try {
                const credential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                const user = credential.user;

                if (user.emailVerified) {
                    showMessage(
                        "Your email is already verified. You can log in.",
                        "success"
                    );

                    await signOut(auth);
                    return;
                }

                await sendEmailVerification(user);
                await signOut(auth);

                showMessage(
                    "A new verification link has been sent. Check your inbox and spam folder.",
                    "success"
                );

            } catch (error) {
                console.error(
                    "Resend Verification Error:",
                    error
                );

                showMessage(
                    "Could not resend the verification email. Check your email and password, then try again."
                );

            } finally {
                resendVerificationBtn.style.pointerEvents = "";
            }
        }
    );
}


/* =========================================================
   AUTH STATE LOGGING
   ========================================================= */

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(
            "Firebase user signed in:",
            user.email,
            "Verified:",
            user.emailVerified
        );
    } else {
        console.log("No user signed in.");
    }
});
