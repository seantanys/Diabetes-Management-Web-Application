document.addEventListener('DOMContentLoaded', function () {
    const measurements = JSON.parse(document.getElementById("pd-dates").value);
    const dates = Object.keys(measurements);
    const bcg = [];
    const bcgDates = [];
    const weight = [];
    const weightDates = [];
    const insulin = [];
    const insulinDates = [];
    const exercise = [];
    const exerciseDates = [];
    const bcgToggle = document.getElementById("bcg-toggle");
    const weightToggle = document.getElementById("weight-toggle");
    const insulinToggle = document.getElementById("insulin-toggle");
    const exerciseToggle = document.getElementById("exercise-toggle");
    const toggles = [];
    var defaultData = [];
    var defaultName = "";

    // parsing the measurement object to individual arrays.
    for (let i = 0; i < dates.length; i++) {
        if ("bcg" in measurements[dates[i]]) {
            bcg.push(measurements[dates[i]]["bcg"]);
            bcgDates.push(getKeyByValue(measurements, measurements[dates[i]]))
        }
        if ("weight" in measurements[dates[i]]) {
            weight.push(measurements[dates[i]]["weight"]);
            weightDates.push(getKeyByValue(measurements, measurements[dates[i]]))
        }
        if ("insulin" in measurements[dates[i]]) {
            insulin.push(measurements[dates[i]]["insulin"]);
            insulinDates.push(getKeyByValue(measurements, measurements[dates[i]]));
        }
        if ("exercise" in measurements[dates[i]]) {
            exercise.push(measurements[dates[i]]["exercise"]);
            exerciseDates.push(getKeyByValue(measurements, measurements[dates[i]]));
        }
    }

    if (bcgToggle) {
        toggles.push(bcgToggle);
    }
    if (insulinToggle) {
        toggles.push(insulinToggle);
    }
    if (weightToggle) {
        toggles.push(weightToggle);
    }
    if (exerciseToggle) {
        toggles.push(exerciseToggle);
    }

    // set default data to be displayed on page load
    for (let i = 0; i < toggles.length; i++) {

        if (toggles[i].innerText === "Blood Glucose Level") {
            defaultData = bcg;
        }
        if (toggles[i].innerText === "Weight") {
            defaultData = weight;
        }
        if (toggles[i].innerText === "Insulin") {
            defaultData = insulin;
        }
        if (toggles[i].innerText === "Exercise") {
            defaultData = exercise;
        }
        defaultName = toggles[i].innerText
        break;
    }

    Highcharts.setOptions({
        chart: {
            style: {
                fontFamily: 'Poppins ,sans-serif'
            }
        }
    });

    const chart = Highcharts.chart('patient-chart-container', {
        chart: {
            type: 'line'
        },
        title: {
            text: defaultName
        },
        xAxis: {
            categories: dates.map(date => {
                return Highcharts.dateFormat('%d-%m-%Y', new Date(date).getTime());
            })
        },
        yAxis: {
            title: {
                text: defaultName
            }
        },
        series: [{
            id: 'bcg',
            name: defaultName,
            data: defaultData
        }],
        responsive: {  
            rules: [{  
                condition: {  
                maxWidth: 500  
                },  
                chartOptions: {  
                    legend: {  
                        enabled: false  
                    },
                    yAxis: {
                        title: {
                            enabled: false
                        }
                    } 
                }  
            }]  
        }
    });

    // toggle between different types of measurements
    if (bcgToggle) {
        bcgToggle.addEventListener('click', function (e) {
            removeAllSeries();
            chart.addSeries({
                name: "Blood Glucose Level",
                id: "bcg",
                data: bcg,
            }, false)
            chart.setTitle({text: "Blood Glucose Level"});
            chart.yAxis[0].setTitle({text: "Blood Glucose Level (nmol/L)"});
            chart.xAxis[0].setCategories(bcgDates.map(date => {
                return Highcharts.dateFormat('%d-%m-%Y', new Date(date).getTime());
            }), false);
            toggleButtons("Blood Glucose Level");
        });
    }
    if (weightToggle) {
        weightToggle.addEventListener('click', function (e) {
            removeAllSeries();
            chart.addSeries({
                name: "Weight",
                id: "weight",
                data: weight,
            }, false)
            chart.setTitle({text: "Weight"});
            chart.yAxis[0].setTitle({text: "Weight (kg)"});
            chart.xAxis[0].setCategories(weightDates.map(date => {
                return Highcharts.dateFormat('%d-%m-%Y', new Date(date).getTime());
            }), false);
            toggleButtons("Weight");
        });
    }
    if (exerciseToggle) {
        exerciseToggle.addEventListener('click', function (e) {
            removeAllSeries();
            chart.addSeries({
                name: "Step Count",
                id: "exercise",
                data: exercise,
            }, false)
            chart.setTitle({text: "Exercise (Step Count)"});
            chart.yAxis[0].setTitle({text: "Step Count"});
            chart.xAxis[0].setCategories(exerciseDates.map(date => {
                return Highcharts.dateFormat('%d-%m-%Y', new Date(date).getTime());
            }), false);
            toggleButtons("Exercise");
        });
    }
    if (insulinToggle) {
        insulinToggle.addEventListener('click', function (e) {
            removeAllSeries();
            chart.addSeries({
                name: "Insulin Doses",
                id: "insulin",
                data: insulin,
            }, false)
            chart.setTitle({text: "Insulin Doses"});
            chart.yAxis[0].setTitle({text: "Insulin Doses (unit)"});
            chart.xAxis[0].setCategories(insulinDates.map(date => {
                return Highcharts.dateFormat('%d-%m-%Y', new Date(date).getTime());
            }), false);
            toggleButtons("Insulin");
        });
    }

    function removeAllSeries() {
        for(var i = chart.series.length - 1; i >= 0; i--) {
            chart.series[i].remove(false);
        }
    }

    // this functions toggles the buttons css
    function toggleButtons(type) {
        for (let i = 0; i < toggles.length; i++) {
            if (toggles[i].innerText === type) {
                toggles[i].classList.add("active-toggle");
                toggles[i].classList.remove("inactive-toggle");
            }
            else {
                toggles[i].classList.add("inactive-toggle");
                toggles[i].classList.remove("active-toggle");
            }
        }
        chart.redraw();
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }

});