const isEmpty = str => !str.trim().length;

window.onload = function () {
    const input = document.getElementById("bcg")
    const btn = document.getElementById("bcg-btn")
    const loader = document.getElementById("loader")

    setTimeout(() => {
      loader.remove();
    }, 1000)
    

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







