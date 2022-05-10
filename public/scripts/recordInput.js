// this script provides visual aids when user enters data, no actual logic. only visuals. (for now)

const isEmpty = str => !str.trim().length;

window.onload = function () {
    const input = document.getElementById("bcg")
    const btn = document.getElementById("bcg-btn")

    if (input) {
        input.addEventListener("input", function() {
            // if the field is entered and then made blank, the field will be highlighted red and button greyed
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







