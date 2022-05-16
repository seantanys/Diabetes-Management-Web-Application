window.addEventListener('DOMContentLoaded', (event) => {
    const searchInput = document.getElementById("pd-search-input");
    const searchFilter = document.getElementById("search-filter");
    var searchCategory = 0

    searchFilter.addEventListener("change", determineFilter);
    searchInput.addEventListener("keyup", search);

    function search() {
        const filter = searchInput.value.toUpperCase();
        const table = document.getElementById("patient-data-table");
        const tr = table.getElementsByTagName("tr");

        for (let i = 0; i < tr.length; i++) {
            const td = tr[i].getElementsByTagName("td")[searchCategory];

            if (td) {
                searchVal = td.textContent || td.innerText;

                if (searchVal.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    function determineFilter() {
        var filterVal = searchFilter.options[searchFilter.selectedIndex].value;
        
        if (filterVal === "measurement") {
            searchCategory = 0;
            searchInput.placeholder = "Search by measurements"
        }
        if (filterVal === "value") {
            searchCategory = 1;
            searchInput.placeholder = "Search by values"
        }
        if (filterVal === "comment") {
            searchCategory = 2;
            searchInput.placeholder = "Search by comments"
        }
        if (filterVal === "time") {
            searchCategory = 3;
            searchInput.placeholder = "Search by time"
        }
    }
});