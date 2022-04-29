const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const { DateTime } = require("luxon");

// hard coded Patient Pat's id for D2
const id = "62660737332717bb9fe3eb55"; 

const getMeasurementPage = async (req, res) => {
    const currTime = DateTime.now().setZone('Australia/Melbourne'); // melb time using library
    const currDate = currTime.startOf('day').toISO();
    const displayTime = currTime.toLocaleString(DateTime.DATETIME_MED)
    // get the patient's data
    const data = await Patient.findById(id).lean();
    // get the patient's recorded data today
    const todayData = await Measurement.find({patientId: id, date: { $gte: currDate}}).lean();

    // get the patients required measurements.
    const reqMeasurements = Object.keys(data["measurements"]) 
    // get the measurments that have already been recorded for today
    const alreadyMeasured = getMeasurementTypes(todayData); 
    // get the measurements that havent been recorded today
    const notMeasured = reqMeasurements.filter(x => !alreadyMeasured.includes(x)); 

    if (data) {
        res.render('record.hbs', { singlePatient: data, measured: alreadyMeasured, 
                                  notMeasured: notMeasured, required: reqMeasurements,
                                  currentTime: displayTime})
    } else {
        console.log("patient data not found")
        res.render('notfound')
    }
}

// helper function to determine the type of measurement (bcg, insulin, etc.)
function getMeasurementTypes(arr) {
    const types = []
    for (let i = 0; i < arr.length; i++) {
        types.push(arr[i].type);
    }
    return types;
}

// this function instantiates a new measurement object and saves it to the db
const submitMeasurement = async (req, res) => {
    try {
        const newMeasurement = new Measurement ({
            type: req.body.type,
            patientId: id,
            value: parseFloat(req.body.value),
            date: Date.now(),
            comment: req.body.comment,
        })
        await newMeasurement.save();
        console.log("Measurement successfully saved to db")
        res.redirect('/patient/record');
    } catch (err) {
        console.log("error submitting measurement.")
    }
}

// this function renders the patient dashboard page
const getPatientPage = async (req, res) => {
    const currTime = DateTime.now().setZone('Australia/Melbourne'); // melb time using library
    const currDate = currTime.startOf('day').toISO();
    // get the patient's data
    const data = await Patient.findById(id).lean(); 
    // get the patient's recorded data today
    const todayData = await Measurement.find({patientId: id, date: { $gte: currDate}}).lean(); 

    // get the patients required measurements.
    const reqMeasurements = Object.keys(data["measurements"])
    // get the measurments that have already been recorded for today 
    const alreadyMeasured = getMeasurementTypes(todayData); 
    // get the measurements that havent been recorded today
    const notMeasured = reqMeasurements.filter(x => !alreadyMeasured.includes(x));
    // format the date for presentation
    const dob = data.dob.getDate().toString().padStart(2,"0") + "/" + 
        (data.dob.getMonth() + 1).toString().padStart(2,"0") + "/" + data.dob.getFullYear().toString() 

    if (data) {
        res.render('patientDashboard.hbs', {dob, singlePatient: data, measured: alreadyMeasured, notMeasured: notMeasured, required: reqMeasurements})
    } else {
        console.log("patient data not found")
        res.render('notfound')
    }
}

const redirectToDashboard = async (req, res) => {
    res.redirect('/patient/dashboard');
}

const getPatientAccountPage = async (req, res) => {
    res.render('account')
}

// exports an object, which contain functions imported by router
module.exports = {
    getMeasurementPage,
    submitMeasurement,
    getPatientPage,
    redirectToDashboard,    
    getPatientAccountPage
}
