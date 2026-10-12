let cartCount = 0;

const cartButtons = document.querySelectorAll(".add-cart");
const cartCountElement = document.querySelector(".cart-count");

cartButtons.forEach((button) => {

 
button.addEventListener("click", () => {

    cartCount++;

    cartCountElement.textContent = cartCount;

    button.innerHTML =
        '<i class="fa-solid fa-check"></i>';

    setTimeout(() => {

        button.innerHTML =
            '<i class="fa-solid fa-cart-plus"></i>';

    }, 1000);

});
 

});
