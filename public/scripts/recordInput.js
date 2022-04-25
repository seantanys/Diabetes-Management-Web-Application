const isEmpty = str => !str.trim().length;

console.log("lol")

window.onload = function () {
    const input = document.getElementById("bcg")
    const btn = document.getElementById("bcg-btn")

    if (input) {
        input.addEventListener("input", function() {
            if( isEmpty(this.value) ) {
            input.classList.add("validation-fail");
            btn.classList.remove("record-button-valid");
            
            } else {
              input.classList.remove("validation-fail");
              btn.classList.add("record-button-valid");
            }
          });
    } else {
        console.log("cannot find element")
    }
}







