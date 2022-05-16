document.addEventListener('DOMContentLoaded', function () {
    const measurements = JSON.parse(document.getElementById("pd-dates").value);
    const dates = Object.keys(measurements);
    const bcg = [];
    const weight = [];
    const insulin = [];
    const exercise = [];
    const bcgToggle = document.getElementById("bcg-toggle");
    const weightToggle = document.getElementById("weight-toggle");
    const insulinToggle = document.getElementById("insulin-toggle");
    const exerciseToggle = document.getElementById("exercise-toggle");
    const toggles = [];
    var defaultData = [];
    var defaultName = "";

    for (let i = 0; i < dates.length; i++) {
        if ("bcg" in measurements[dates[i]]) {
            bcg.push(measurements[dates[i]]["bcg"]);
        }
        if ("weight" in measurements[dates[i]]) {
            weight.push(measurements[dates[i]]["weight"]);
        }
        if ("insulin" in measurements[dates[i]]) {
            insulin.push(measurements[dates[i]]["insulin"]);
        }
        if ("exercise" in measurements[dates[i]]) {
            exercise.push(measurements[dates[i]]["exercise"]);
        }
    }

    if (bcgToggle) {
        toggles.push(bcgToggle);
    }
    if (weightToggle) {
        toggles.push(weightToggle);
    }
    if (insulinToggle) {
        toggles.push(insulinToggle);
    }
    if (exerciseToggle) {
        toggles.push(exerciseToggle);
    }

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

    if (bcgToggle) {
        bcgToggle.addEventListener('click', function (e) {
            chart.series[0].setData(bcg, false);
            chart.setTitle({text: "Blood Glucose Level"});
            chart.yAxis[0].setTitle({text: "Blood Glucose Level (nmol/L)"});
            chart.series[0].update({name:"Blood Glucose"}, false);
            toggleButtons("Blood Glucose Level");
        });
    }
    if (weightToggle) {
        weightToggle.addEventListener('click', function (e) {
            chart.series[0].setData(weight, false);
            chart.setTitle({text: "Weight"});
            chart.yAxis[0].setTitle({text: "Weight (kg)"});
            toggleButtons("Weight");
            chart.series[0].update({name:"Weight"}, true);
        });
    }
    if (exerciseToggle) {
        exerciseToggle.addEventListener('click', function (e) {
            chart.series[0].setData(exercise, false);
            chart.setTitle({text: "Step Count"});
            chart.yAxis[0].setTitle({text: "Steps"});
            toggleButtons("Exercise");
            chart.series[0].update({name:"Step Count"}, false);
        });
    }
    if (insulinToggle) {
        insulinToggle.addEventListener('click', function (e) {
            chart.series[0].setData(insulin, false);
            chart.setTitle({text: "Insulin Doses"});
            chart.yAxis[0].setTitle({text: "Insulin Doses (unit)"});
            toggleButtons("Insulin");
            chart.series[0].update({name:"Insulin Doses"}, true);
        });
    }

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

});