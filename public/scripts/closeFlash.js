window.addEventListener('DOMContentLoaded', (event) => {
    const flash = document.querySelector(".flash");
    const btn = document.getElementById("flash-close-btn");

    if (btn) {
        btn.addEventListener("click", function() {
            if (!flash) {
                console.log("lol")
            }
            flash.style.display = "none";
        }
    )}
    else {
        console.log("button not found")
    }
})
