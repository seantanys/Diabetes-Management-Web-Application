window.addEventListener('DOMContentLoaded', (event) => {
    const tabs = document.querySelectorAll('.drilldown-nav-bar a')
    const noteContainers = document.querySelectorAll('.note-container');
    const noteOptions = document.querySelectorAll('.note-option')
    const dataRows = document.querySelectorAll('.patient-data-row');
    const noteInput = document.getElementById('comment');
    const noteColorInput = document.getElementById('note-color')

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

    noteOptions.forEach(noteOption => {
        noteOption.addEventListener('click', toggleOption)
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

    function toggleOption() {      
        noteOptions.forEach(o => {
            o.classList.remove('note-selected-option');
        })
        this.classList.add('note-selected-option');
        noteColorInput.value = this.id;
    }

});