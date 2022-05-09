window.addEventListener('DOMContentLoaded', (event) => {
    console.log("lol")
    const form = document.getElementById('log-in-form')
    const username = document.getElementById('username')
    const password = document.getElementById('pw')

    form.addEventListener('submit', e => {
        e.preventDefault();
        validateInputs();
    })

    const displayError = (element, message) => {
        const inputBox = element.parentElement;
        const errorDisplay = inputBox.querySelector('.login-error');

        errorDisplay.innerText = message;
        inputBox.classList.add('error')
        inputBox.classList.remove('success')
    }

    const displaySuccess = (element) => {
        const inputBox = element.parentElement;
        const errorDisplay = inputBox.querySelector('.login-error');

        errorDisplay.innerText = '';
        inputBox.classList.remove('error')
        inputBox.classList.add('success')
    }

    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const validateInputs = () => {
        const usernameValue = username.value.trim();
        const passswordValue = password.value.trim();

        // if email field is empty
        if (usernameValue === '') {
            displayError(username, 'E-mail address is required.')
        } else if (!isValidEmail(usernameValue)){
            displayError(username, 'Please provide a valid email address.')
        }
        else {
            setSuccess(username)
        }

        if (passswordValue === '') {
            displayError(password, 'Password is required.')
        }
        else {
            displaySuccess(password)
        }
    }

})