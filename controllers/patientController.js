const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')

// hard coded Patient Pat's id for D2
const id = "62660737332717bb9fe3eb55"; 

const getMeasurementPage = async (req, res) => {
    const currentTime = new Date()
    currentTime.setHours(0, 0, 0);
    const data = await Patient.findById(id).lean();
    const todayData = await Measurement.find({patientId: id, date: { $gte: currentTime}}).lean();

    const reqMeasurements = Object.keys(data["measurements"])
    const alreadyMeasured = getMeasurementTypes(todayData);
    const notMeasured = reqMeasurements.filter(x => !alreadyMeasured.includes(x));

    if (data) {
        res.render('record.hbs', { singlePatient: data, measured: alreadyMeasured, notMeasured: notMeasured, required: reqMeasurements})
    } else {
        console.log("patient data not found")
        res.render('notfound')
    }
}

function getMeasurementTypes(arr) {
    const types = []
    for (let i = 0; i < arr.length; i++) {
        types.push(arr[i].type);
    }
    return types;
}

const submitMeasurement = async (req, res) => {
    try {
        const newMeasurement = new Measurement ({
            type: req.body.type,
            patientId: id,
            value: parseFloat(req.body.value),
            date: Date.now(),
            comment: req.body.comment
        })
        await newMeasurement.save();
        console.log("Measurement successfully saved to db")
        res.redirect('/patient/record');
    } catch (err) {
        console.log("error submitting measurement.")
    }
}

const getPatientPage = async (req, res) => {
    const currentTime = new Date()
    currentTime.setHours(0, 0, 0);
    const data = await Patient.findById(id).lean();
    const todayData = await Measurement.find({patientId: id, date: { $gte: currentTime}}).lean();

    const reqMeasurements = Object.keys(data["measurements"])
    const alreadyMeasured = getMeasurementTypes(todayData);
    const notMeasured = reqMeasurements.filter(x => !alreadyMeasured.includes(x));
    const dob = data.dob.getDate().toString().padStart(2,"0") + "/" + (data.dob.getMonth() + 1).toString().padStart(2,"0") + "/" + data.dob.getFullYear().toString()
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
