window.addEventListener('DOMContentLoaded', (event) => {
    const tabs = document.querySelectorAll('.drilldown-nav-bar a')
    console.log(tabs)
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