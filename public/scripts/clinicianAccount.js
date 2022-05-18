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
});