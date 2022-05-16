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
    

    if (bcgToggle) {
        bcgToggle.addEventListener('click', toggleChart);
    }
    if (weightToggle) {
        weightToggle.addEventListener('click', toggleChart);
    }
    if (insulinToggle) {
        insulinToggle.addEventListener('click', toggleChart);
    }
    if (exerciseToggle) {
        exerciseToggle.addEventListener('click', toggleChart);
    }

    function toggleChart() {
        // give class or active-toggle and remove inactive-toggle
        // then give other classes inactive and remove active-toggle
        
        // then display the specified chart
        // and hide the others.
    }

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
            text: 'Blood Glucose Level'
        },
        xAxis: {
            categories: dates.map(date => {
                return Highcharts.dateFormat('%d-%m-%Y', new Date(date).getTime());
            })
        },
        yAxis: {
            title: {
                text: 'Blood Glucose Level (nmol/L)'
            }
        },
        series: [{
            name: 'Blood Glucose',
            data: bcg
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

});