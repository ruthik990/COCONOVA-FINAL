// ============================================================
// COCONOVA - CUSTOMER ACCOUNT
// ============================================================

import {
    auth,
    db
} from "./firebase-config.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// ELEMENTS
// ============================================================

const userName =
    document.getElementById("userName");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const ordersContainer =
    document.getElementById("ordersContainer");

const logoutBtn =
    document.getElementById("logoutBtn");


// ============================================================
// CHECK ELEMENTS
// ============================================================

console.log("COCONOVA ACCOUNT JS LOADED");

console.log("auth:", auth);

console.log("db:", db);

console.log(
    "ordersContainer:",
    ordersContainer
);


// ============================================================
// CART COUNT
// ============================================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("COCONOVACart")
        ) || [];

    const count =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 1),
            0
        );

    const cartCount =
        document.querySelector(".cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }
}


// ============================================================
// MONEY
// ============================================================

function money(value) {

    return "₹" +
        Number(value || 0)
            .toLocaleString("en-IN");

}


// ============================================================
// DATE
// ============================================================

function formatDate(timestamp) {

    if (!timestamp) {
        return "Date unavailable";
    }

    try {

        const date =
            timestamp.toDate
                ? timestamp.toDate()
                : new Date(timestamp);

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch {

        return "Date unavailable";

    }
}


// ============================================================
// STATUS
// ============================================================

function getStatus(status) {

    if (!status) {
        return "Pending";
    }

    const value =
        String(status)
            .trim()
            .toLowerCase();


    if (
        value === "pending" ||
        value === "placed" ||
        value === "order placed"
    ) {
        return "Pending";
    }


    if (
        value === "processing" ||
        value === "confirmed"
    ) {
        return "Processing";
    }


    if (
        value === "shipped" ||
        value === "dispatch" ||
        value === "dispatched"
    ) {
        return "Shipped";
    }


    if (
        value === "out for delivery" ||
        value === "out_for_delivery"
    ) {
        return "Out for Delivery";
    }


    if (
        value === "delivered" ||
        value === "completed" ||
        value === "complete"
    ) {
        return "Delivered";
    }


    if (
        value === "cancelled" ||
        value === "canceled"
    ) {
        return "Cancelled";
    }


    return status;
}


// ============================================================
// TRACKING
// ============================================================

function trackingHTML(status) {

    const current =
        getStatus(status);


    if (current === "Cancelled") {

        return `

            <div class="tracking-section">

                <div class="tracking-title">

                    <i class="fa-solid fa-location-dot"></i>

                    Order Tracking

                </div>


                <div class="tracking-cancelled">

                    <div class="tracking-icon">

                        <i class="fa-solid fa-xmark"></i>

                    </div>


                    <div>

                        <strong>
                            Order Cancelled
                        </strong>

                        <p>
                            This order has been cancelled.
                        </p>

                    </div>

                </div>

            </div>

        `;
    }


    const steps = [

        {
            name: "Order Placed",
            icon: "fa-clipboard-check"
        },

        {
            name: "Processing",
            icon: "fa-gears"
        },

        {
            name: "Shipped",
            icon: "fa-truck"
        },

        {
            name: "Out for Delivery",
            icon: "fa-truck-fast"
        },

        {
            name: "Delivered",
            icon: "fa-box-open"
        }

    ];


    const positions = {

        "Pending": 0,

        "Processing": 1,

        "Shipped": 2,

        "Out for Delivery": 3,

        "Delivered": 4

    };


    const currentPosition =
        positions[current] ?? 0;


    return `

        <div class="tracking-section">

            <div class="tracking-title">

                <i class="fa-solid fa-location-dot"></i>

                Order Tracking

            </div>


            <div class="tracking-timeline">

                ${steps.map((step, index) => {

                    let state = "";

                    if (index < currentPosition) {
                        state = "completed";
                    }

                    if (index === currentPosition) {
                        state = "active";
                    }


                    return `

                        <div class="
                            tracking-step
                            ${state}
                        ">

                            <div class="tracking-circle">

                                <i class="
                                    fa-solid
                                    ${step.icon}
                                "></i>

                            </div>


                            <div class="
                                tracking-step-content
                            ">

                                <strong>
                                    ${step.name}
                                </strong>


                                ${
                                    index === currentPosition
                                    ?
                                    `
                                    <span>
                                        Current Status
                                    </span>
                                    `
                                    :
                                    ""
                                }

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

        </div>

    `;
}


// ============================================================
// PRODUCTS
// ============================================================

function productsHTML(products) {

    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        return `
            <p>
                Product information unavailable.
            </p>
        `;

    }


    return products.map(product => {

        const image =
            product.image ||
            "cocopeat-5kg.jpg";


        const quantity =
            Number(product.quantity || 1);


        const price =
            Number(product.price || 0);


        return `

            <div class="
                customer-order-product-row
            ">

                <div class="
                    customer-order-product-image
                ">

                    <img
                        src="${image}"
                        alt="${product.name || "Product"}"
                        onerror="
                            this.src='cocopeat-5kg.jpg'
                        "
                    >

                </div>


                <div class="
                    customer-order-product-info
                ">

                    <strong>
                        ${product.name || "Product"}
                    </strong>


                    <span>
                        Quantity: ${quantity}
                    </span>


                    <span>
                        Price: ${money(price)}
                    </span>

                </div>


                <strong class="product-price">

                    ${money(price * quantity)}

                </strong>

            </div>

        `;

    }).join("");

}


// ============================================================
// ORDER CARD
// ============================================================

function orderHTML(order) {

    const data =
        order.data;


    const orderNumber =
        data.orderNumber ||
        order.id
            .substring(0, 8)
            .toUpperCase();


    const status =
        getStatus(data.status);


    const address =
        data.address || {};


    const addressText = [

        address.address,
        address.city,
        address.state,
        address.pincode

    ]
        .filter(Boolean)
        .join(", ");


    return `

        <article class="
            customer-order-card
        ">


            <!-- ORDER HEADER -->

            <div class="
                customer-order-top
            ">

                <div>

                    <span class="order-label">
                        ORDER
                    </span>


                    <h3>
                        #${orderNumber}
                    </h3>


                    <p>
                        Placed on
                        ${formatDate(data.createdAt)}
                    </p>

                </div>


                <div class="
                    customer-order-status
                    status-${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}
                ">

                    ${status}

                </div>

            </div>


            <!-- TRACKING -->

            ${trackingHTML(status)}


            <!-- PRODUCTS -->

            <div class="
                customer-order-products
            ">

                <div class="
                    order-section-heading
                ">

                    <i class="fa-solid fa-box"></i>

                    Items Ordered

                </div>


                ${productsHTML(data.products)}

            </div>


            <!-- ADDRESS -->

            ${
                addressText
                ?
                `

                <div class="
                    customer-order-address
                ">

                    <div class="
                        order-section-heading
                    ">

                        <i class="
                            fa-solid
                            fa-location-dot
                        "></i>

                        Delivery Address

                    </div>


                    <p>
                        ${addressText}
                    </p>

                </div>

                `
                :
                ""
            }


            <!-- PAYMENT / TOTAL -->

            <div class="
                customer-order-bottom
            ">


                <div class="
                    customer-payment-info
                ">

                    <span>
                        Payment
                    </span>


                    <strong>
                        ${
                            data.paymentMethod ||
                            "Online"
                        }
                    </strong>


                    <small>
                        ${
                            data.paymentStatus ||
                            "Pending"
                        }
                    </small>

                </div>


                <div class="
                    customer-order-summary
                ">

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${money(data.subtotal)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Shipping
                        </span>

                        <strong>
                            ${money(data.shipping)}
                        </strong>

                    </div>


                    <div class="order-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${money(data.total)}
                        </strong>

                    </div>

                </div>

            </div>


        </article>

    `;
}


// ============================================================
// DISPLAY ORDERS
// ============================================================

function displayOrders(orders) {

    if (!ordersContainer) {
        return;
    }


    if (orders.length === 0) {

        ordersContainer.innerHTML = `

            <div class="no-orders">

                <div class="no-orders-icon">

                    <i class="fa-solid fa-box-open"></i>

                </div>


                <h3>
                    No Orders Yet
                </h3>


                <p>
                    You haven't placed any orders yet.
                </p>


                <a href="shop.html">
                    Start Shopping
                </a>

            </div>

        `;

        return;
    }


    // Newest first

    orders.sort((a, b) => {

        const dateA =
            a.data.createdAt?.toMillis
            ? a.data.createdAt.toMillis()
            : 0;


        const dateB =
            b.data.createdAt?.toMillis
            ? b.data.createdAt.toMillis()
            : 0;


        return dateB - dateA;

    });


    ordersContainer.innerHTML =
        orders
            .map(orderHTML)
            .join("");

}


// ============================================================
// LOAD ORDERS
// ============================================================

function loadOrders(user) {

    console.log(
        "Loading orders for UID:",
        user.uid
    );


    ordersContainer.innerHTML = `

        <div class="orders-loading">

            <i class="
                fa-solid
                fa-spinner
                fa-spin
            "></i>

            <span>
                Loading your orders...
            </span>

        </div>

    `;


    const ordersRef =
        collection(db, "orders");


    // --------------------------------------------------------
    // NEW ORDERS
    // --------------------------------------------------------

    const userIdQuery =
        query(
            ordersRef,
            where(
                "userId",
                "==",
                user.uid
            )
        );


    // --------------------------------------------------------
    // OLD ORDERS
    // --------------------------------------------------------

    const customerIdQuery =
        query(
            ordersRef,
            where(
                "customerId",
                "==",
                user.uid
            )
        );


    let userOrders = [];

    let customerOrders = [];


    function combineOrders() {

        const orderMap =
            new Map();


        userOrders.forEach(order => {

            orderMap.set(
                order.id,
                order
            );

        });


        customerOrders.forEach(order => {

            orderMap.set(
                order.id,
                order
            );

        });


        displayOrders(
            Array.from(orderMap.values())
        );

    }


    // --------------------------------------------------------
    // USER ID LISTENER
    // --------------------------------------------------------

    onSnapshot(

        userIdQuery,

        snapshot => {

            console.log(
                "Orders using userId:",
                snapshot.size
            );


            userOrders =
                snapshot.docs.map(doc => ({

                    id: doc.id,

                    data: doc.data()

                }));


            combineOrders();

        },

        error => {

            console.error(
                "userId orders error:",
                error
            );

        }

    );


    // --------------------------------------------------------
    // CUSTOMER ID LISTENER
    // --------------------------------------------------------

    onSnapshot(

        customerIdQuery,

        snapshot => {

            console.log(
                "Orders using customerId:",
                snapshot.size
            );


            customerOrders =
                snapshot.docs.map(doc => ({

                    id: doc.id,

                    data: doc.data()

                }));


            combineOrders();

        },

        error => {

            console.error(
                "customerId orders error:",
                error
            );

        }

    );

}


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(

    auth,

    user => {

        console.log(
            "AUTH STATE:",
            user
        );


        if (!user) {

            console.log(
                "No customer logged in."
            );


            if (ordersContainer) {

                ordersContainer.innerHTML = `

                    <div class="no-orders">

                        <h3>
                            Please Login
                        </h3>

                        <p>
                            Login to view your orders.
                        </p>

                        <a href="login.html">
                            Login
                        </a>

                    </div>

                `;

            }


            return;

        }


        console.log(
            "CUSTOMER UID:",
            user.uid
        );


        // ----------------------------------------------------
        // PROFILE
        // ----------------------------------------------------

        const name =
            user.displayName ||
            "Customer";


        if (userName) {

            userName.textContent =
                name;

        }


        if (profileName) {

            profileName.textContent =
                name;

        }


        if (profileEmail) {

            profileEmail.textContent =
                user.email || "";

        }


        // ----------------------------------------------------
        // ORDERS
        // ----------------------------------------------------

        loadOrders(user);

    }

);


// ============================================================
// LOGOUT
// ============================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Unable to logout."
                );

            }

        }
    );

}


// ============================================================
// START
// ============================================================

updateCartCount();