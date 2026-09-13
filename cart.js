// ==========================================
// COCONOVA CART
// ==========================================


// ==========================================
// GET CART
// ==========================================

let cart = JSON.parse(
    localStorage.getItem("COCONOVACart")
) || [];


// ==========================================
// ELEMENTS
// ==========================================

const cartItemsContainer =
    document.getElementById("cartItems");

const subtotalElement =
    document.getElementById("subtotal");

const shippingElement =
    document.getElementById("shipping");

const totalElement =
    document.getElementById("total");

const cartCountElement =
    document.querySelector(".cart-count");

const checkoutBtn =
    document.getElementById("checkoutBtn");


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    // Get latest cart
    cart = JSON.parse(
        localStorage.getItem("COCONOVACart")
    ) || [];


    if (!cartItemsContainer) return;


    cartItemsContainer.innerHTML = "";


    // ======================================
    // EMPTY CART
    // ======================================

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>Your cart is empty</h2>

                <p>
                    Looks like you haven't added anything yet.
                </p>

                <a href="shop.html">
                    Start Shopping
                </a>

            </div>

        `;


        if (subtotalElement) {
            subtotalElement.textContent = "₹0";
        }


        if (shippingElement) {
            shippingElement.textContent = "₹0";
        }


        if (totalElement) {
            totalElement.textContent = "₹0";
        }


        if (checkoutBtn) {

            checkoutBtn.disabled = true;

            checkoutBtn.style.opacity = "0.5";

            checkoutBtn.style.cursor =
                "not-allowed";

        }


        updateCartCount();

        return;
    }


    // ======================================
    // ENABLE CHECKOUT
    // ======================================

    if (checkoutBtn) {

        checkoutBtn.disabled = false;

        checkoutBtn.style.opacity = "1";

        checkoutBtn.style.cursor = "pointer";

    }


    // ======================================
    // DISPLAY PRODUCTS
    // ======================================

    cart.forEach(item => {

        /*
         * IMPORTANT:
         * item.image contains something like:
         *
         * cocopeat-5kg.jpg
         *
         * We must create an actual <img>
         * instead of displaying the filename.
         */

        const image =
            item.image &&
            String(item.image).trim() !== ""
                ? String(item.image).trim()
                : "";


        cartItemsContainer.innerHTML += `

            <div class="cart-item">


                <!-- PRODUCT IMAGE -->

                <div class="cart-item-image">

                    ${
                        image
                        ?
                        `
                        <img
                            src="${image}"
                            alt="${item.name || "Product"}"
                            onerror="this.style.display='none'; this.parentElement.classList.add('image-error');"
                        >
                        `
                        :
                        `
                        <div class="image-placeholder">
                            <i class="fa-solid fa-image"></i>
                        </div>
                        `
                    }

                </div>


                <!-- PRODUCT DETAILS -->

                <div class="cart-item-details">

                    <h3>
                        ${item.name || "Product"}
                    </h3>

                    <p>
                        ₹${Number(item.price || 0).toLocaleString()}
                    </p>

                </div>


                <!-- PRODUCT ACTIONS -->

                <div class="cart-item-actions">


                    <!-- QUANTITY -->

                    <div class="quantity-controls">

                        <button
                            class="quantity-btn decrease-btn"
                            data-id="${item.id}"
                            type="button"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <span class="quantity">
                            ${Number(item.quantity || 1)}
                        </span>


                        <button
                            class="quantity-btn increase-btn"
                            data-id="${item.id}"
                            type="button"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>


                    <!-- REMOVE -->

                    <button
                        class="remove-btn"
                        data-id="${item.id}"
                        type="button"
                    >

                        <i class="fa-solid fa-trash"></i>

                        Remove

                    </button>


                </div>


            </div>

        `;

    });


    // Add button functionality
    addCartButtonEvents();

    // Update price summary
    updateSummary();

    // Update navbar cart count
    updateCartCount();

}


// ==========================================
// BUTTON EVENTS
// ==========================================

function addCartButtonEvents() {


    // ======================================
    // INCREASE
    // ======================================

    document
        .querySelectorAll(".increase-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changeQuantity(
                        Number(button.dataset.id),
                        1
                    );

                }
            );

        });


    // ======================================
    // DECREASE
    // ======================================

    document
        .querySelectorAll(".decrease-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changeQuantity(
                        Number(button.dataset.id),
                        -1
                    );

                }
            );

        });


    // ======================================
    // REMOVE
    // ======================================

    document
        .querySelectorAll(".remove-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    removeFromCart(
                        Number(button.dataset.id)
                    );

                }
            );

        });

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(productId, change) {

    const item =
        cart.find(
            item =>
                Number(item.id) === productId
        );


    if (!item) return;


    item.quantity =
        Number(item.quantity || 1) + change;


    // Remove if quantity becomes zero
    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item =>
                    Number(item.id) !== productId
            );

    }


    saveCart();

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                Number(item.id) !== productId
        );


    saveCart();

}


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "COCONOVACart",
        JSON.stringify(cart)
    );


    displayCart();

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    if (!cartCountElement) return;


    const totalItems =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );


    cartCountElement.textContent =
        totalItems;

}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

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


    // ======================================
    // SHIPPING
    // ======================================

    const shipping =
        subtotal >= 2000
            ? 0
            : 150;


    // ======================================
    // TOTAL
    // ======================================

    const total =
        subtotal + shipping;


    // ======================================
    // DISPLAY
    // ======================================

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

}


// ==========================================
// CHECKOUT
// ==========================================

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {
                return;
            }


            window.location.href =
                "checkout.html";

        }
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

displayCart();


console.log(
    "COCONOVA Cart:",
    cart
);