window.addEventListener('DOMContentLoaded', (event) => {
    const flash = document.querySelector(".flash");
    const btn = document.getElementById("flash-close-btn");

    if (btn) {
        btn.addEventListener("click", function() {
            if (flash) {
                flash.style.display = "none";
            }
        }
    )}
    else {
        console.log("button not found")
    }
})
