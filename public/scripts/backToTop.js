window.addEventListener('DOMContentLoaded', (event) => {

    // https://www.w3schools.com/howto/howto_js_scroll_to_top.asp

    //Get the button:
    btn = document.getElementById("back-to-top-btn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    btn.addEventListener('click', topFunction);

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    }


    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
});