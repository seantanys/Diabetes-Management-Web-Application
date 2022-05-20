window.addEventListener('DOMContentLoaded', (event) => {
    const tabs = document.querySelectorAll('.drilldown-nav-bar a')
    const noteContainers = document.querySelectorAll('.note-container');

    noteContainers.forEach(note => {
        const btn = note.querySelector('.note-del-btn')
        const form = note.querySelector('.note-del-form')

        btn.addEventListener("click", function() {
            if (form) {
                form.submit();
            }
        });
    })

    tabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
    })

    function switchTab() {
        toggleActive(this.innerText)
    }

    function toggleActive(text) {
        tabs.forEach(tab => {
            if (tab.innerText !== text) {
                tab.classList.remove("active-overview-tab");
            }
            else {
                tab.classList.add("active-overview-tab");
            }
        })
    }

});