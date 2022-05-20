window.addEventListener('DOMContentLoaded', (event) => {
    const tabs = document.querySelectorAll('.drilldown-nav-bar a')
    const noteContainers = document.querySelectorAll('.note-container');
    const dataRows = document.querySelectorAll('.patient-data-row');
    const noteInput = document.getElementById('comment')

    noteContainers.forEach(note => {
        const btn = note.querySelector('.note-del-btn')
        const form = note.querySelector('.note-del-form')

        btn.addEventListener("click", function() {
            if (form) {
                form.submit();
            }
        });
    })

    dataRows.forEach(row => {
        const noteBtn = row.childNodes[9];
        const measurementType = row.childNodes[1];
        const measurementValue = row.childNodes[3];
        const measurementDate = row.childNodes[7];

        noteBtn.addEventListener('click', function() {
            noteInput.value = `${measurementType.innerText}, ${measurementValue.innerText}, measured on ${measurementDate.innerText}.
                                    `
        })
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