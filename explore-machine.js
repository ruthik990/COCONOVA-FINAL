/* =========================================================
   COCONOVE MACHINE EXPLORER
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const machineImage =
    document.getElementById("machineImage");

const viewLabel =
    document.getElementById("viewLabel");

const zoomValue =
    document.getElementById("zoomValue");

const zoomIn =
    document.getElementById("zoomIn");

const zoomOut =
    document.getElementById("zoomOut");

const resetView =
    document.getElementById("resetView");

const fullscreenBtn =
    document.getElementById("fullscreenBtn");

const imageLoader =
    document.getElementById("imageLoader");

const viewButtons =
    document.querySelectorAll(".view-btn");

const viewerArea =
    document.querySelector(".viewer-image-area");


/* =========================================================
   VARIABLES
========================================================= */

let zoom = 1;

const minZoom = 1;

const maxZoom = 2.5;

const zoomStep = 0.1;


/* =========================================================
   UPDATE ZOOM
========================================================= */

function updateZoom() {

    machineImage.style.transform =
        `scale(${zoom})`;

    zoomValue.textContent =
        `${Math.round(zoom * 100)}%`;
}


/* =========================================================
   ZOOM IN
========================================================= */

zoomIn.addEventListener("click", () => {

    if (zoom < maxZoom) {

        zoom += zoomStep;

        zoom =
            Math.min(
                zoom,
                maxZoom
            );

        updateZoom();
    }

});


/* =========================================================
   ZOOM OUT
========================================================= */

zoomOut.addEventListener("click", () => {

    if (zoom > minZoom) {

        zoom -= zoomStep;

        zoom =
            Math.max(
                zoom,
                minZoom
            );

        updateZoom();
    }

});


/* =========================================================
   RESET
========================================================= */

resetView.addEventListener("click", () => {

    zoom = 1;

    updateZoom();

    machineImage.style.transform =
        "scale(1)";

});


/* =========================================================
   CHANGE MACHINE VIEW
========================================================= */

viewButtons.forEach(button => {

    button.addEventListener("click", () => {

        const newImage =
            button.dataset.image;

        const newLabel =
            button.dataset.label;


        /* active button */

        viewButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        /* loading */

        imageLoader.classList.add("show");


        machineImage.style.opacity = "0";


        const preload =
            new Image();

        preload.src =
            newImage;


        preload.onload = () => {

            setTimeout(() => {

                machineImage.src =
                    newImage;

                viewLabel.textContent =
                    newLabel;


                zoom = 1;

                updateZoom();


                machineImage.style.opacity =
                    "1";

                imageLoader.classList.remove(
                    "show"
                );

            }, 200);

        };


        preload.onerror = () => {

            imageLoader.classList.remove(
                "show"
            );

            machineImage.style.opacity =
                "1";

            console.log(
                "Image not found:",
                newImage
            );

            alert(
                `Image "${newImage}" was not found. Please check the filename.`
            );

        };

    });

});


/* =========================================================
   MOUSE WHEEL ZOOM
========================================================= */

viewerArea.addEventListener(
    "wheel",
    (event) => {

        event.preventDefault();

        if (event.deltaY < 0) {

            zoom += zoomStep;

        } else {

            zoom -= zoomStep;

        }

        zoom =
            Math.max(
                minZoom,
                Math.min(
                    maxZoom,
                    zoom
                )
            );

        updateZoom();

    },
    {
        passive: false
    }
);


/* =========================================================
   FULLSCREEN
========================================================= */

fullscreenBtn.addEventListener(
    "click",
    () => {

        if (!document.fullscreenElement) {

            if (
                viewerArea.requestFullscreen
            ) {

                viewerArea.requestFullscreen();

            }

        } else {

            document.exitFullscreen();

        }

    }
);


/* =========================================================
   FULLSCREEN ICON UPDATE
========================================================= */

document.addEventListener(
    "fullscreenchange",
    () => {

        const icon =
            fullscreenBtn.querySelector("i");

        if (document.fullscreenElement) {

            icon.className =
                "fa-solid fa-compress";

        } else {

            icon.className =
                "fa-solid fa-expand";

        }

    }
);


/* =========================================================
   DRAG TO PAN / INSPECT
========================================================= */

let isDragging = false;

let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;


viewerArea.addEventListener(
    "mousedown",
    (event) => {

        if (zoom <= 1) return;

        isDragging = true;

        startX =
            event.clientX - currentX;

        startY =
            event.clientY - currentY;

        viewerArea.style.cursor =
            "grabbing";

    }
);


window.addEventListener(
    "mousemove",
    (event) => {

        if (!isDragging) return;

        currentX =
            event.clientX - startX;

        currentY =
            event.clientY - startY;


        machineImage.style.transform =
            `translate(${currentX}px, ${currentY}px) scale(${zoom})`;

    }
);


window.addEventListener(
    "mouseup",
    () => {

        isDragging = false;

        viewerArea.style.cursor =
            "default";

    }
);


/* =========================================================
   RESET POSITION WHEN ZOOM CHANGES
========================================================= */

function resetPosition() {

    currentX = 0;

    currentY = 0;

}


/* =========================================================
   UPDATED ZOOM FUNCTION
========================================================= */

function updateZoom() {

    if (zoom === 1) {

        resetPosition();

    }

    machineImage.style.transform =
        `translate(${currentX}px, ${currentY}px) scale(${zoom})`;

    zoomValue.textContent =
        `${Math.round(zoom * 100)}%`;
}


/* =========================================================
   MOBILE TOUCH ZOOM / PAN
========================================================= */

let touchStartX = 0;
let touchStartY = 0;


viewerArea.addEventListener(
    "touchstart",
    (event) => {

        if (event.touches.length !== 1) {
            return;
        }

        touchStartX =
            event.touches[0].clientX - currentX;

        touchStartY =
            event.touches[0].clientY - currentY;

    },
    {
        passive: true
    }
);


viewerArea.addEventListener(
    "touchmove",
    (event) => {

        if (
            event.touches.length !== 1 ||
            zoom <= 1
        ) {
            return;
        }

        currentX =
            event.touches[0].clientX -
            touchStartX;

        currentY =
            event.touches[0].clientY -
            touchStartY;


        machineImage.style.transform =
            `translate(${currentX}px, ${currentY}px) scale(${zoom})`;

    },
    {
        passive: true
    }
);


/* =========================================================
   SCROLL FUNCTIONS
========================================================= */

function scrollToViewer() {

    document
        .getElementById("machineViewer")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function scrollToProcess() {

    document
        .getElementById("process")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "+") {

            zoomIn.click();

        }

        if (event.key === "-") {

            zoomOut.click();

        }

        if (event.key === "0") {

            resetView.click();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

updateZoom();

console.log(
    "COCONOVE Machine Explorer Loaded"
);