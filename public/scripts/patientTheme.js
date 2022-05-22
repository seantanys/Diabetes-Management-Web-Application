window.addEventListener('DOMContentLoaded', (event) => {


    const form = document.getElementById("theme-form");
    const default_btn = document.getElementById("default-theme");
    const dark_btn = document.getElementById("dark-theme");
    const spring_btn = document.getElementById("spring-theme");
    const autumn_btn = document.getElementById("matrix-theme");
    const theme_text = document.getElementById("selected-theme");

    const btns = [default_btn, dark_btn, spring_btn, autumn_btn];

    for (let btn in btns) {
        btns[btn].addEventListener('click', selectTheme);
    }

    function selectTheme() {
        const selected = form.theme.value

        if (!selected) {
            return
        }

        if (selected === 'default') {
            theme_text.innerText = "default";
        }
        else if (selected === 'dark') {
            theme_text.innerText = "dark";
        }
        else if (selected === 'matrix') {
            theme_text.innerText = "matrix";
        }
        else if (selected === 'spring') {
            theme_text.innerText = "spring";
        }
    }
  });