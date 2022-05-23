window.addEventListener('DOMContentLoaded', (event) => {

    const bcgCheckbox = document.getElementById("recordBCG");
    const weightCheckbox = document.getElementById("recordWeight");
    const insulinCheckbox = document.getElementById("recordInsulin");
    const exerciseCheckbox = document.getElementById("recordExercise");

    const bcgThreshold = document.getElementById("bcg-threshold");
    const weightThreshold = document.getElementById("weight-threshold");
    const insulinThreshold = document.getElementById("insulin-threshold");
    const exerciseThreshold = document.getElementById("exercise-threshold")

    bcgCheckbox.addEventListener('change', function() {
        if (this.checked) {
          bcgThreshold.style.display = "block";

        } else {
            bcgThreshold.style.display = "none";
        }
    });

    weightCheckbox.addEventListener('change', function() {
        if (this.checked) {
            weightThreshold.style.display = "block";

        } else {
            weightThreshold.style.display = "none";
        }
    });

    insulinCheckbox.addEventListener('change', function() {
        if (this.checked) {
            insulinThreshold.style.display = "block";

        } else {
            insulinThreshold.style.display = "none";
        }
    });

    exerciseCheckbox.addEventListener('change', function() {
        if (this.checked) {
            exerciseThreshold.style.display = "block";

        } else {
            exerciseThreshold.style.display = "none";
        }
    });

});