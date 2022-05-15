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
          const inputs = bcgThreshold.getElementsByTagName('input');

          for (let i = 0; i < inputs.length; i++) {
              inputs[i].setAttribute('required', '');
          }

        } else {
            bcgThreshold.style.display = "none";
            const inputs = bcgThreshold.getElementsByTagName('input');

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].removeAttribute('required');
            }
        }
    });

    weightCheckbox.addEventListener('change', function() {
        if (this.checked) {
            weightThreshold.style.display = "block";
            const inputs = weightThreshold.getElementsByTagName('input');

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute('required', '');
            }

        } else {
            weightThreshold.style.display = "none";
            const inputs = weightThreshold.getElementsByTagName('input');

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].removeAttribute('required');
            }
        }
    });

    insulinCheckbox.addEventListener('change', function() {
        if (this.checked) {
            insulinThreshold.style.display = "block";
            const inputs = insulinThreshold.getElementsByTagName('input');

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute('required', '');
            }

        } else {
            insulinThreshold.style.display = "none";
            const inputs = insulinThreshold.getElementsByTagName('input');

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].removeAttribute('required');
            }
        }
    });

    exerciseCheckbox.addEventListener('change', function() {
        if (this.checked) {
            exerciseThreshold.style.display = "block";
            const inputs = exerciseThreshold.getElementsByTagName('input');

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute('required', '');
            }

        } else {
            exerciseThreshold.style.display = "none";
            const inputs = exerciseThreshold.getElementsByTagName('input');

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].removeAttribute('required');
            }
        }
    });

});