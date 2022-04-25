
window.onload = function () {
    const menuToggle = document.getElementById("menuToggleCheckbox");
    const hamborger = document.querySelector('input');

    menuToggle.addEventListener('change', e => {
        if(e.target.checked === true) {
          document.body.classList.add("fixed-position")
        }
      if(e.target.checked === false) {
        document.body.classList.remove("fixed-position")
        }
      });
}


