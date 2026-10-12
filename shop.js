// =============================================
// COCONOVA SHOP
// =============================================


// =============================================
// PRODUCTS DATA
// =============================================

const products = [

    // =========================================
    // COCOPEAT PRODUCTS
    // =========================================

    {
        id: 1,
        name: "Premium Cocopeat Block",
        category: "cocopeat",
        price: 250,
        image: "cocopeat-block.jpg",

        description:
            "High-quality compressed cocopeat block suitable for gardening and agriculture."
    },

    {
        id: 2,
        name: "Cocopeat 5 KG Block",
        category: "cocopeat",
        price: 450,
        image: "cocopeat-5kg.jpg",

        description:
            "Premium cocopeat block ideal for nurseries, gardening and plant cultivation."
    },

    {
        id: 3,
        name: "Cocopeat 25 KG Bale",
        category: "cocopeat",
        price: 1200,
        image: "cocopeat-25kg.jpg",

        description:
            "Large compressed cocopeat bale designed for commercial and agricultural use."
    },

    {
        id: 4,
        name: "Cocopeat Grow Bag",
        category: "cocopeat",
        price: 180,
        image: "cocopeat-grow-bag.jpg",

        description:
            "Ready-to-use cocopeat grow bag for plants, nurseries and greenhouse cultivation."
    },


    // =========================================
    // COIR FIBER PRODUCTS
    // =========================================

    {
        id: 5,
        name: "Natural Coir Fiber",
        category: "fiber",
        price: 300,
        image: "coir-fiber.jpg",

        description:
            "Natural coconut coir fiber suitable for agricultural and industrial applications."
    },

    {
        id: 6,
        name: "Coir Fiber Bale",
        category: "fiber",
        price: 850,
        image: "coir-fiber-bale.jpg",

        description:
            "Compressed natural coir fiber bale for bulk agricultural and industrial applications."
    },


    // =========================================
    // MACHINE PRODUCTS
    // =========================================

    {
        id: 7,
        name: "Cocopeat Processing Machine",
        category: "machines",
        price: 60000,
        image: "machine-main.jpg",

        description:
            "Industrial machine designed for efficient coconut husk and cocopeat processing."
    },


];


// =============================================
// GET HTML ELEMENTS
// =============================================

const shopProducts =
    document.getElementById("shopProducts");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const cartCountElements =
    document.querySelectorAll(".cart-count");


// =============================================
// GET CART
// =============================================

let cart =
    JSON.parse(
        localStorage.getItem("COCONOVACart")
    ) || [];


// =============================================
// DISPLAY PRODUCTS
// =============================================

function displayProducts(productList) {

    if (!shopProducts) return;


    // Clear existing products

    shopProducts.innerHTML = "";


    // No products message

    if (productList.length === 0) {

        shopProducts.innerHTML = `

            <div class="no-products">

                <i class="fa-solid fa-box-open"></i>

                <h3>
                    No Products Found
                </h3>

                <p>
                    Please select another category.
                </p>

            </div>

        `;

        return;
    }


    // Create product cards

    productList.forEach(product => {


        const productCard =
            document.createElement("div");


        productCard.className =
            "product-card";


        // Machine or normal product button

        const productAction =

            product.category === "machines"

                ?

                `
                <a
                    href="explore-machine.html"
                    class="explore-machine-btn"
                >

                    <i class="fa-solid fa-microchip"></i>

                    Explore Machine

                </a>
                `

                :

                `
                <button
                    class="add-cart-btn"
                    data-product-id="${product.id}"
                >

                    <i class="fa-solid fa-cart-plus"></i>

                    Add to Cart

                </button>
                `;


        // Product price

        const productPrice =

            product.price > 0

                ?

                `₹${product.price}`

                :

                `Contact Us`;


        // Product card HTML

        productCard.innerHTML = `

            <!-- PRODUCT IMAGE -->

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>


            <!-- PRODUCT INFORMATION -->

            <div class="product-info">


                <!-- CATEGORY -->

                <span class="product-category">

                    ${formatCategory(product.category)}

                </span>


                <!-- NAME -->

                <h3>

                    ${product.name}

                </h3>


                <!-- DESCRIPTION -->

                <p>

                    ${product.description}

                </p>


                <!-- BOTTOM -->

                <div class="product-bottom">


                    <!-- PRICE -->

                    <span class="product-price">

                        ${productPrice}

                    </span>


                    <!-- ACTION -->

                    ${productAction}


                </div>


            </div>

        `;


        // Add card to page

        shopProducts.appendChild(
            productCard
        );

    });


    // Add event listeners to Add to Cart buttons

    const addCartButtons =
        document.querySelectorAll(
            ".add-cart-btn"
        );


    addCartButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const productId =
                    Number(
                        button.dataset.productId
                    );


                addToCart(productId);

            }
        );

    });

}


// =============================================
// FORMAT CATEGORY NAME
// =============================================

function formatCategory(category) {

    const categories = {

        cocopeat: "Cocopeat",

        fiber: "Coir Fiber",

        machines: "Machines"

    };


    return categories[category] || category;

}


// =============================================
// ADD PRODUCT TO CART
// =============================================

function addToCart(productId) {


    // Find product

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    // Check if product already exists

    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {


        // Increase quantity

        existingProduct.quantity += 1;


    } else {


        // Add new product

        cart.push({

            ...product,

            quantity: 1

        });

    }


    // Save cart

    localStorage.setItem(

        "COCONOVACart",

        JSON.stringify(cart)

    );


    // Update cart number

    updateCartCount();


    // Show notification

    showNotification(
        `${product.name} added to cart!`
    );

}


// =============================================
// UPDATE CART COUNT
// =============================================

function updateCartCount() {


    const totalItems =
        cart.reduce(

            (total, item) =>
                total + item.quantity,

            0

        );


    cartCountElements.forEach(element => {

        element.textContent =
            totalItems;

    });

}


// =============================================
// FILTER PRODUCTS
// =============================================

function filterProducts(category) {


    if (category === "all") {


        displayProducts(products);

    }

    else {


        const filteredProducts =
            products.filter(

                product =>
                    product.category === category

            );


        displayProducts(
            filteredProducts
        );

    }

}


// =============================================
// FILTER BUTTON EVENTS
// =============================================

filterButtons.forEach(button => {


    button.addEventListener(
        "click",
        () => {


            // Remove active class

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            // Add active class

            button.classList.add(
                "active"
            );


            // Get category

            const category =
                button.dataset.category;


            // Filter products

            filterProducts(category);

        }
    );

});


// =============================================
// READ CATEGORY FROM URL
// =============================================

function loadCategoryFromURL() {


    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    if (!category) {

        displayProducts(products);

        return;

    }


    // Check if category exists

    const validCategories = [

        "all",

        "cocopeat",

        "fiber",

        "machines"

    ];


    if (
        validCategories.includes(
            category
        )
    ) {


        // Display category

        filterProducts(category);


        // Update active button

        filterButtons.forEach(button => {

            button.classList.toggle(

                "active",

                button.dataset.category === category

            );

        });


    }

    else {

        displayProducts(products);

    }

}


// =============================================
// NOTIFICATION
// =============================================

function showNotification(message) {


    // Remove old notification if exists

    const oldNotification =
        document.querySelector(
            ".shop-notification"
        );


    if (oldNotification) {

        oldNotification.remove();

    }


    // Create notification

    const notification =
        document.createElement("div");


    notification.className =
        "shop-notification";


    notification.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>
            ${message}
        </span>

    `;


    document.body.appendChild(
        notification
    );


    // Show animation

    setTimeout(() => {

        notification.classList.add(
            "show"
        );

    }, 10);


    // Hide notification

    setTimeout(() => {

        notification.classList.remove(
            "show"
        );


        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 2500);

}


// =============================================
// START SHOP
// =============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // Load products

        loadCategoryFromURL();


        // Update cart

        updateCartCount();


    }
);