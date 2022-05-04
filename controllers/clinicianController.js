const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const { DateTime } = require("luxon");

const mType = {
    bcg: "bcg",
    weight: "weight",
    insulin: "insulin",
    exercise: "exercise",
};

function getDatesInRange(startDate, endDate) {
    const date = new Date(endDate);
    date.setUTCHours(0,0,0,0)

    const dates = [];

    while (date >= startDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() - 1);
    } 
    return dates;
}

function leftJoin(arr1, arr2, date1, date2) {
    const resultArray = (arr1, arr2, date1, date2) => arr1.map(
        item1 => ({
            ...arr2.find(
                item2 => item1[date1] === item2[date2.setUTCHours(0,0,0,0)]
            ),
            ...item1
        })
    )
    return resultArray;
}

function getTableArray(dates, measurement) {
    const outputArray = []
    for (i in dates) {
        date = dates[i]
        for (j in measurement) {
            dataDate = new Date(measurement[j].date)
            dataDate.setUTCHours(0,0,0,0)
            if (date.getTime() === dataDate.getTime()) {
                outputArray.push(measurement[j])
            } else {
                outputArray.push(date)
            }
        }
    }
}

// function which handles requests for displaying patient name and measurement on clinician 
// dashboard finds the most recent measurement entered by a patient and displays it
// it is highlighted if its not in the safety threshold
const getAllPatientData = async (req, res, next) => {
    const patientDashboard = []

    const currTime = DateTime.now().setZone('Australia/Melbourne'); // melb time using library
    const currDate = currTime.startOf('day').toISO()
    const todaysDate = currTime.toLocaleString(DateTime.DATETIME_MED);

    try {
        // for each patient in the Patients collection, we search for their latest measurements within the
        // Measurements collection and store it in the patient dashboard list which is sent to the 
        // clinician dashboard handlebar, along with the total number of patients for that clinician 
        // and todays date
        const patients = await Patient.find().lean()
        for (let i = 0; i < patients.length; i++) {

            bcgmeasurement = await Measurement.findOne({patientId: patients[i]._id.toString(), type:'bcg'}).sort({"date": -1}).lean()
            weightmeasurement = await Measurement.findOne({patientId: patients[i]._id.toString(), type:'weight'}).sort({"date": -1}).lean()
            insulinmeasurement = await Measurement.findOne({patientId: patients[i]._id.toString(), type:'insulin'}).sort({"date": -1}).lean()
            exercisemeasurement = await Measurement.findOne({patientId: patients[i]._id.toString(), type:'exercise'}).sort({"date": -1}).lean()

            patientDashboard.push({
                                   patient: patients[i],
                                   bcg: (bcgmeasurement)?bcgmeasurement['value']:"",
                                   weight: (weightmeasurement)?weightmeasurement['value']:"",
                                   insulin: (insulinmeasurement)?insulinmeasurement['value']:"",
                                   exercise: (exercisemeasurement)?exercisemeasurement['value']:""
                                })
        }
        
        return res.render('clinicianDashboard', { layout: "clinician.hbs", data: patientDashboard, numPatients: patients.length, date: todaysDate})

    } catch (err) {
        return next(err)
    }
}

// function which handles requests for displaying patient overview
// will be implemented for D3
const getPatientById = async(req, res, next) => {

    try {

        const patient = await Patient.findById(req.params.patient_id).lean()
        const dates = await getDatesInRange(new Date(patient.join_date), new Date())

        // Get arrays of measurements of each type
        bcgmeasurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'bcg'}).sort({"date": -1}).lean()
        weightmeasurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'weight'}).sort({"date": -1}).lean()
        insulinmeasurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'insulin'}).sort({"date": -1}).lean()
        exercisemeasurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'exercise'}).sort({"date": -1}).lean()
        
        var mArray = []
        mArray.push(bcgmeasurement)
        mArray.push(weightmeasurement)
        mArray.push(insulinmeasurement)
        mArray.push(exercisemeasurement)        

        // Make new array with all the dates from join date to now, with measurements
        
        mTrend = []
        for (m in mArray) {
            if (mArray[m].length == 0) {
                mTrend.push(mArray[m])
            } else {
                tempArray = []
                for (i in dates) {
                    match = false
                    for (j in mArray[m]) {
                        dataDate = new Date(mArray[m][j].date)
                        dataDate.setUTCHours(0,0,0,0)
                        if (dates[i].getTime() === dataDate.getTime()) {
                            tempArray.push(mArray[m][j])
                            match = true
                            break
                        } 
                    }
                    if (!match) {
                        tempArray.push({date: dates[i], value: undefined, comment: ''})
                    }
                }
            mTrend.push(tempArray)
            console.log("m " + m + "adds"+  mTrend)
            }
        }

        if (!patient) {
            // no patient found in database
            return res.render('notfound')
        }
        
        
        // found patient
        // render clinicianTabs -- base page is overview
        return res.render('clinicianTabs', { oneItem: patient, dataset: mArray, dateRange:dates})

    } catch (err) {
        return next(err)
    }
}

// function which handles requests for displaying the create form
// will be implemented for D3
const getNewPatientForm = async (req, res, next) => {
    try {
        return res.render('newPatient')
    } catch (err) {
        return next(err)
    }
}

// function which handles requests for creating a new patient
// will be implemented for D3
const insertData = async (req, res, next) => {
    try {
        const newPatient = new Patient({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            join_date: req.body.join_date,
            recordBCG: req.body.recordBCG,
            recordWeight: req.body.recordWeight,
            recordInsulin: req.body.recordInsulin,
            recordExercise: req.body.recordExercise,

        })
        await newPatient.save();
        return res.redirect('/clinician/dashboard')
    }catch (err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllPatientData,
    getPatientById,
    insertData,
    getNewPatientForm
}