// ==========================================
// COCONOVA - MY ORDERS
// ==========================================


// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const ordersContainer =
    document.getElementById(
        "customerOrdersContainer"
    );

const ordersLoading =
    document.getElementById(
        "ordersLoading"
    );

const ordersCount =
    document.getElementById(
        "ordersCount"
    );

const cartCount =
    document.querySelector(
        ".cart-count"
    );


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const cart = JSON.parse(
        localStorage.getItem("COCONOVACart")
    ) || [];


    const totalItems = cart.reduce(
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
// FORMAT DATE
// ==========================================

function formatDate(timestamp) {

    if (!timestamp) {

        return "Recently placed";

    }


    try {

        const date =
            timestamp.toDate
                ? timestamp.toDate()
                : new Date(timestamp);


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }

    catch (error) {

        return "Recently placed";

    }

}


// ==========================================
// GET STATUS CLASS
// ==========================================

function getStatusClass(status) {

    const cleanStatus =
        String(status || "Pending")
            .toLowerCase()
            .replace(/\s+/g, "-");


    return "status-" + cleanStatus;

}


// ==========================================
// DISPLAY ORDERS
// ==========================================

function displayOrders(orders) {

    if (!ordersContainer) {

        console.error(
            "customerOrdersContainer not found"
        );

        return;

    }


    // ======================================
    // HIDE LOADING
    // ======================================

    if (ordersLoading) {

        ordersLoading.style.display =
            "none";

    }


    // ======================================
    // ORDER COUNT
    // ======================================

    if (ordersCount) {

        ordersCount.textContent =
            orders.length +
            (
                orders.length === 1
                    ? " Order"
                    : " Orders"
            );

    }


    // ======================================
    // NO ORDERS
    // ======================================

    if (orders.length === 0) {

        ordersContainer.innerHTML = `

            <div class="no-customer-orders">

                <i class="fa-solid fa-box-open"></i>

                <h2>No Orders Yet</h2>

                <p>
                    You haven't placed any orders yet.
                </p>

                <a href="shop.html">

                    <i class="fa-solid fa-cart-shopping"></i>

                    Start Shopping

                </a>

            </div>

        `;

        return;

    }


    // ======================================
    // CLEAR
    // ======================================

    ordersContainer.innerHTML = "";


    // ======================================
    // DISPLAY ORDERS
    // ======================================

    orders.forEach(orderData => {

        const order =
            orderData.data;


        // ==================================
        // ORDER DETAILS
        // ==================================

        const orderNumber =
            order.orderNumber ||
            orderData.id;


        const status =
            order.status ||
            "Pending";


        const products =
            order.products || [];


        const customer =
            order.customer || {};


        const address =
            order.address || {};


        const subtotal =
            Number(order.subtotal || 0);


        const shipping =
            Number(order.shipping || 0);


        const total =
            Number(order.total || 0);


        const paymentMethod =
            order.paymentMethod ||
            "Cash on Delivery";


        const paymentStatus =
            order.paymentStatus ||
            "Pending";


        // ==================================
        // PRODUCTS
        // ==================================

        let productsHTML = "";


        products.forEach(item => {

            const productName =
                item.name ||
                "Product";


            const quantity =
                Number(item.quantity || 1);


            const price =
                Number(item.price || 0);


            const itemTotal =
                price * quantity;


            const image =
                item.image &&
                String(item.image).trim() !== ""
                    ? String(item.image).trim()
                    : "";


            productsHTML += `

                <div class="customer-order-product-row">


                    <div class="product-info">


                        ${
                            image
                            ?
                            `
                            <img
                                src="${image}"
                                alt="${productName}"
                                class="customer-order-product-image"
                                onerror="this.style.display='none';"
                            >
                            `
                            :
                            `
                            <div class="customer-order-product-placeholder">
                                <i class="fa-solid fa-image"></i>
                            </div>
                            `
                        }


                        <div>

                            <h4>
                                ${productName}
                            </h4>


                            <p>

                                Quantity:
                                ${quantity}

                                ×

                                ₹${price.toLocaleString("en-IN")}

                            </p>

                        </div>

                    </div>


                    <div class="product-price">

                        ₹${itemTotal.toLocaleString("en-IN")}

                    </div>


                </div>

            `;

        });


        // ==================================
        // NO PRODUCTS
        // ==================================

        if (products.length === 0) {

            productsHTML = `

                <p class="no-products">

                    Product details unavailable.

                </p>

            `;

        }


        // ==================================
        // ORDER CARD
        // ==================================

        ordersContainer.innerHTML += `

            <div class="customer-order-card">


                <!-- ==========================
                     ORDER HEADER
                =========================== -->

                <div class="customer-order-top">


                    <div>

                        <h2>

                            Order #

                            ${orderNumber}

                        </h2>


                        <p class="customer-order-date">

                            <i class="fa-regular fa-calendar"></i>

                            ${formatDate(
                                order.createdAt
                            )}

                        </p>

                    </div>


                    <span class="
                        customer-order-status
                        ${getStatusClass(status)}
                    ">

                        ${String(status).toUpperCase()}

                    </span>


                </div>



                <!-- ==========================
                     CUSTOMER DETAILS
                =========================== -->

                <div class="customer-order-customer">

                    <h3>

                        <i class="fa-solid fa-user"></i>

                        Customer Details

                    </h3>


                    <p>

                        <strong>
                            ${customer.fullName || "Customer"}
                        </strong>

                    </p>


                    <p>

                        <i class="fa-solid fa-envelope"></i>

                        ${customer.email || "No email"}

                    </p>


                    <p>

                        <i class="fa-solid fa-phone"></i>

                        ${customer.phone || "No phone"}

                    </p>

                </div>



                <!-- ==========================
                     DELIVERY ADDRESS
                =========================== -->

                <div class="customer-order-address">

                    <h3>

                        <i class="fa-solid fa-location-dot"></i>

                        Delivery Address

                    </h3>


                    <p>
                        ${address.address || ""}
                    </p>


                    <p>

                        ${address.city || ""}

                        ${
                            address.city &&
                            address.state
                                ? ", "
                                : ""
                        }

                        ${address.state || ""}

                    </p>


                    <p>

                        ${
                            address.pincode
                                ? "PIN: " +
                                  address.pincode
                                : ""
                        }

                    </p>

                </div>



                <!-- ==========================
                     PRODUCTS
                =========================== -->

                <div class="customer-order-products">

                    <h3>

                        <i class="fa-solid fa-box"></i>

                        Ordered Products

                    </h3>


                    ${productsHTML}

                </div>



                <!-- ==========================
                     ORDER SUMMARY
                =========================== -->

                <div class="customer-order-summary">


                    <div>

                        <span>
                            Subtotal
                        </span>


                        <strong>

                            ₹${subtotal.toLocaleString("en-IN")}

                        </strong>

                    </div>


                    <div>

                        <span>
                            Shipping
                        </span>


                        <strong>

                            ${
                                shipping === 0
                                    ? "FREE"
                                    : "₹" +
                                      shipping.toLocaleString("en-IN")
                            }

                        </strong>

                    </div>


                    <div class="customer-final-total">

                        <span>
                            Total Amount
                        </span>


                        <strong>

                            ₹${total.toLocaleString("en-IN")}

                        </strong>

                    </div>


                </div>



                <!-- ==========================
                     PAYMENT
                =========================== -->

                <div class="customer-payment-info">


                    <p>

                        Payment Method

                        <strong>
                            ${paymentMethod}
                        </strong>

                    </p>


                    <p>

                        Payment Status

                        <strong>
                            ${paymentStatus}
                        </strong>

                    </p>


                </div>


            </div>

        `;

    });

}


// ==========================================
// LOAD CUSTOMER ORDERS
// ==========================================

function loadCustomerOrders(user) {

    console.log(
        "Loading orders for customer UID:",
        user.uid
    );


    const ordersRef =
        collection(
            db,
            "orders"
        );


    // =================================================
    // IMPORTANT FINAL QUERY
    //
    // CHECKOUT SAVES:
    //
    // userId: user.uid
    //
    // FIRESTORE RULES ALSO USE:
    //
    // resource.data.userId
    //
    // Therefore we MUST query userId.
    // =================================================

    const ordersQuery =
        query(

            ordersRef,

            where(
                "userId",
                "==",
                user.uid
            )

        );


    // ======================================
    // REALTIME LISTENER
    // ======================================

    onSnapshot(

        ordersQuery,


        (snapshot) => {

            console.log(
                "Customer orders found:",
                snapshot.size
            );


            const orders = [];


            snapshot.forEach(doc => {

                orders.push({

                    id: doc.id,

                    data: doc.data()

                });

            });


            // ==================================
            // NEWEST FIRST
            // ==================================

            orders.sort(
                (a, b) => {

                    const timeA =
                        a.data.createdAt
                            ?.toMillis?.()
                        || 0;


                    const timeB =
                        b.data.createdAt
                            ?.toMillis?.()
                        || 0;


                    return timeB - timeA;

                }
            );


            displayOrders(
                orders
            );

        },


        (error) => {

            console.error(
                "ORDER LOAD ERROR:",
                error
            );


            if (ordersLoading) {

                ordersLoading.style.display =
                    "none";

            }


            if (ordersContainer) {

                ordersContainer.innerHTML = `

                    <div class="no-customer-orders">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        <h2>
                            Could not load orders
                        </h2>

                        <p>
                            ${error.message}
                        </p>

                    </div>

                `;

            }

        }

    );

}


// ==========================================
// AUTH CHECK
// ==========================================

onAuthStateChanged(

    auth,

    (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        console.log(
            "Logged in customer:",
            user.email
        );


        console.log(
            "Customer UID:",
            user.uid
        );


        loadCustomerOrders(
            user
        );

    }

);


// ==========================================
// INITIAL LOAD
// ==========================================

updateCartCount();


console.log(
    "COCONOVA My Orders Loaded"
);