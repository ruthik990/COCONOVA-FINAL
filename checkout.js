// ==========================================
// COCONOVA CHECKOUT
// ==========================================


// ==========================================
// FIREBASE IMPORTS
// ==========================================

import {
    auth,
    db
} from "./firebase-config.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// GET CART
// ==========================================

let cart =
    JSON.parse(
        localStorage.getItem("COCONOVACart")
    ) || [];


// ==========================================
// ELEMENTS
// ==========================================

const checkoutItems =
    document.getElementById("checkoutItems");

const subtotalElement =
    document.getElementById("subtotal");

const shippingElement =
    document.getElementById("shipping");

const totalElement =
    document.getElementById("total");

const cartCount =
    document.querySelector(".cart-count");

const checkoutForm =
    document.getElementById("checkoutForm");

const fullNameInput =
    document.getElementById("fullName");

const emailInput =
    document.getElementById("email");


// ==========================================
// AUTH CHECK
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        sessionStorage.setItem(
            "redirectAfterLogin",
            "checkout.html"
        );

        window.location.href =
            "login.html";

        return;
    }


    console.log(
        "Logged in customer UID:",
        user.uid
    );


    if (
        fullNameInput &&
        user.displayName
    ) {

        fullNameInput.value =
            user.displayName;

    }


    if (
        emailInput &&
        user.email
    ) {

        emailInput.value =
            user.email;

    }

});


// ==========================================
// DISPLAY CHECKOUT ITEMS
// ==========================================

function displayCheckoutItems() {

    cart =
        JSON.parse(
            localStorage.getItem("COCONOVACart")
        ) || [];


    if (cart.length === 0) {

        if (checkoutItems) {

            checkoutItems.innerHTML = `

                <div class="empty-cart">

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Please add products before checkout.
                    </p>

                    <a href="shop.html">
                        Go to Shop
                    </a>

                </div>

            `;

        }

        return;
    }


    if (!checkoutItems) {
        return;
    }


    checkoutItems.innerHTML = "";


    cart.forEach(item => {

        const image =
            item.image &&
            String(item.image).trim() !== ""
                ? String(item.image).trim()
                : "";


        checkoutItems.innerHTML += `

            <div class="checkout-item">

                <div class="checkout-item-left">

                    <div class="checkout-item-image">

                        ${
                            image
                            ?
                            `
                            <img
                                src="${image}"
                                alt="${item.name || "Product"}"
                                onerror="
                                    this.style.display='none';
                                    this.parentElement.classList.add('image-error');
                                "
                            >
                            `
                            :
                            `
                            <div class="checkout-image-placeholder">

                                <i class="fa-solid fa-image"></i>

                            </div>
                            `
                        }

                    </div>


                    <div>

                        <div class="checkout-item-name">

                            ${item.name || "Product"}

                        </div>


                        <div class="checkout-item-quantity">

                            Quantity:
                            ${Number(item.quantity || 1)}

                        </div>

                    </div>

                </div>


                <div class="checkout-item-price">

                    ₹${(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                    ).toLocaleString("en-IN")}

                </div>

            </div>

        `;

    });

}


// ==========================================
// CALCULATE TOTALS
// ==========================================

function calculateTotals() {

    const subtotal =
        cart.reduce(
            (total, item) => {

                return total +
                    (
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                    );

            },
            0
        );


    const shipping =
        subtotal >= 2000
            ? 0
            : 150;


    const total =
        subtotal + shipping;


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" +
            subtotal.toLocaleString("en-IN");

    }


    if (shippingElement) {

        shippingElement.textContent =
            shipping === 0
                ? "FREE"
                : "₹" +
                  shipping.toLocaleString("en-IN");

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" +
            total.toLocaleString("en-IN");

    }


    return {
        subtotal,
        shipping,
        total
    };

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const totalItems =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }

}


// ==========================================
// PLACE ORDER
// ==========================================

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            console.log(
                "PLACE ORDER CLICKED"
            );


            // ==================================
            // CHECK AUTH
            // ==================================

            const user =
                auth.currentUser;


            if (!user) {

                alert(
                    "Please login before placing your order."
                );


                sessionStorage.setItem(
                    "redirectAfterLogin",
                    "checkout.html"
                );


                window.location.href =
                    "login.html";

                return;

            }


            // ==================================
            // RELOAD CART
            // ==================================

            cart =
                JSON.parse(
                    localStorage.getItem(
                        "COCONOVACart"
                    )
                ) || [];


            if (cart.length === 0) {

                alert(
                    "Your cart is empty!"
                );


                window.location.href =
                    "shop.html";

                return;

            }


            // ==================================
            // TOTALS
            // ==================================

            const totals =
                calculateTotals();


            // ==================================
            // PAYMENT
            // ==================================

            const paymentInput =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            const paymentMethod =
                paymentInput
                    ? paymentInput.value
                    : "Cash on Delivery";


            // ==================================
            // BUTTON
            // ==================================

            const orderButton =
                checkoutForm.querySelector(
                    "button[type='submit']"
                );


            let originalText =
                "Place Order";


            if (orderButton) {

                originalText =
                    orderButton.innerHTML;

                orderButton.disabled =
                    true;

                orderButton.innerHTML =
                    "Placing Order...";

            }


            try {

                // ==================================
                // CUSTOMER
                // ==================================

                const fullName =
                    document
                        .getElementById("fullName")
                        ?.value
                        .trim() || "";


                const email =
                    document
                        .getElementById("email")
                        ?.value
                        .trim() || "";


                const phone =
                    document
                        .getElementById("phone")
                        ?.value
                        .trim() || "";


                // ==================================
                // ADDRESS
                // ==================================

                const address =
                    document
                        .getElementById("address")
                        ?.value
                        .trim() || "";


                const city =
                    document
                        .getElementById("city")
                        ?.value
                        .trim() || "";


                const state =
                    document
                        .getElementById("state")
                        ?.value
                        .trim() || "";


                const pincode =
                    document
                        .getElementById("pincode")
                        ?.value
                        .trim() || "";


                // ==================================
                // ORDER NUMBER
                // ==================================

                const orderNumber =
                    "COCO-" + Date.now();


                // ==================================
                // ORDER DATA
                // ==================================

                const orderData = {

                    userId:
                        user.uid,

                    customerId:
                        user.uid,


                    orderNumber:
                        orderNumber,


                    customer: {

                        fullName:
                            fullName,

                        email:
                            email,

                        phone:
                            phone

                    },


                    address: {

                        address:
                            address,

                        city:
                            city,

                        state:
                            state,

                        pincode:
                            pincode

                    },


                    products:
                        cart,


                    subtotal:
                        totals.subtotal,

                    shipping:
                        totals.shipping,

                    total:
                        totals.total,


                    paymentMethod:
                        paymentMethod,

                    paymentStatus:
                        "Pending",


                    status:
                        "Pending",


                    createdAt:
                        serverTimestamp()

                };


                // ==================================
                // DEBUG
                // ==================================

                console.log(
                    "AUTH OBJECT:",
                    auth
                );

                console.log(
                    "FIRESTORE OBJECT:",
                    db
                );

                console.log(
                    "CURRENT USER:",
                    user.uid
                );

                console.log(
                    "ORDER DATA:",
                    orderData
                );


                // ==================================
                // SAVE TO FIRESTORE
                // ==================================

                const ordersCollection =
                    collection(
                        db,
                        "orders"
                    );


                const docRef =
                    await addDoc(
                        ordersCollection,
                        orderData
                    );


                console.log(
                    "ORDER SUCCESS:",
                    docRef.id
                );


                // ==================================
                // SAVE SUCCESS INFO
                // ==================================

                localStorage.setItem(
                    "lastCOCONOVAOrder",
                    JSON.stringify({

                        firestoreId:
                            docRef.id,

                        orderNumber:
                            orderNumber,

                        customerName:
                            fullName,

                        total:
                            totals.total,

                        paymentMethod:
                            paymentMethod,

                        status:
                            "Pending"

                    })
                );


                // ==================================
                // CLEAR CART
                // ==================================

                localStorage.removeItem(
                    "COCONOVACart"
                );


                // ==================================
                // SUCCESS
                // ==================================

                window.location.href =
                    "order-success.html";

            }


            catch (error) {

                console.error(
                    "ORDER ERROR:",
                    error
                );


                alert(
                    "Could not place your order.\n\n" +
                    error.message
                );


                if (orderButton) {

                    orderButton.disabled =
                        false;

                    orderButton.innerHTML =
                        originalText;

                }

            }

        }
    );

}


// ==========================================
// INITIALIZE
// ==========================================

displayCheckoutItems();

calculateTotals();

updateCartCount();


console.log(
    "COCONOVA CHECKOUT LOADED"
);