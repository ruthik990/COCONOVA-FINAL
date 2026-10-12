document.addEventListener("DOMContentLoaded", function () {

    const slides =
        document.querySelectorAll(".intro-slide");

    const progressBar =
        document.getElementById("progressBar");

    const currentSlide =
        document.getElementById("currentSlide");

    const skipIntro =
        document.getElementById("skipIntro");

    const enterButtons =
        document.querySelectorAll(".enter-btn");


    // ==========================================
    // SETTINGS
    // ==========================================

    let current = 0;

    const totalSlides = Math.min(4, slides.length);

    const slideTime = 3000;

    let timer = null;


    // ==========================================
    // SHOW SLIDE
    // ==========================================

    function showSlide(index) {

        slides.forEach(function (slide, i) {

            slide.classList.remove("active");

            if (i === index) {
                slide.classList.add("active");
            }

        });


        current = index;


        // Update number

        if (currentSlide) {

            currentSlide.textContent =
                String(current + 1).padStart(2, "0");

        }


        // Update progress bar

        if (progressBar) {

            const percentage =
                ((current + 1) / totalSlides) * 100;

            progressBar.style.width =
                percentage + "%";

        }

    }


    // ==========================================
    // OPEN MAIN WEBSITE
    // ==========================================

    function openHome() {

        if (timer !== null) {

            clearInterval(timer);

            timer = null;

        }


        // Tell index.html that intro is complete

        sessionStorage.setItem(
            "COCONOVAIntroShown",
            "true"
        );


        // Go to main website

        window.location.replace("index.html");

    }


    // ==========================================
    // NEXT SLIDE
    // ==========================================

    function nextSlide() {

        if (current < totalSlides - 1) {

            showSlide(current + 1);

        } else {

            openHome();

        }

    }


    // ==========================================
    // START
    // ==========================================

    if (totalSlides === 0) {

        openHome();

        return;

    }


    showSlide(0);


    timer = setInterval(
        nextSlide,
        slideTime
    );


    // ==========================================
    // ENTER COCONOVA
    // ==========================================

    enterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openHome();

            }
        );

    });


    // ==========================================
    // SKIP INTRO
    // ==========================================

    if (skipIntro) {

        skipIntro.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openHome();

            }
        );

    }


    // ==========================================
    // KEYBOARD
    // ==========================================

    document.addEventListener(
        "keydown",
        function (event) {

            // Right arrow = next slide

            if (event.key === "ArrowRight") {

                nextSlide();

            }


            // Escape = enter website

            if (event.key === "Escape") {

                openHome();

            }

        }
    );

});