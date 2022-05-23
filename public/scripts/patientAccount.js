
window.addEventListener('DOMContentLoaded', (event) => {
    const password = document.getElementById("npw")
    const confirm_password = document.getElementById("cpw");
    const button = document.getElementById("change-pw-btn")

    function validatePassword(){
    if(password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
        confirm_password.setCustomValidity('');
    }
    }

    button.addEventListener('click', validatePassword())
    
    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;

    const mediaQuery = window.matchMedia('(max-width: 375px)')
    if (mediaQuery.matches) {

        const detailsRadio = document.getElementById("tab1");
        const passRadio = document.getElementById("tab2");
        const themeRadio = document.getElementById("tab3");
        const dashboard = document.querySelector(".patient-account-dashboard");

        themeRadio.addEventListener("change", function () {
            if (themeRadio.checked) {
                dashboard.style.height = "1800px";
            }
        })

        passRadio.addEventListener("change", function () {
            if (passRadio.checked) {
                dashboard.style.height = "800px";
            }
        })

        detailsRadio.addEventListener("change", function () {
            if (detailsRadio.checked) {
                dashboard.style.height = "1200px";
            }
        })
        
    }

    const mediaQueryTablet = window.matchMedia('(min-width: 1024px)')
    if (mediaQueryTablet.matches) {

        const detailsRadio = document.getElementById("tab1");
        const passRadio = document.getElementById("tab2");
        const themeRadio = document.getElementById("tab3");
        const dashboard = document.querySelector(".patient-account-dashboard");

        themeRadio.addEventListener("change", function () {
            if (themeRadio.checked) {
                dashboard.style.height = "1600px";
            }
        })

        passRadio.addEventListener("change", function () {
            if (passRadio.checked) {
                dashboard.style.height = "800px";
            }
        })

        detailsRadio.addEventListener("change", function () {
            if (detailsRadio.checked) {
                dashboard.style.height = "800px";
            }
        })
        
    }
  });