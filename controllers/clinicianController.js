const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const {User} = require('../models/user')
const { DateTime } = require("luxon");

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
        
        return res.render('clinicianDashboard', {loggedIn: req.isAuthenticated(), data: patientDashboard, numPatients: patients.length, date: todaysDate})

    } catch (err) {
        return next(err)
    }
}

// function which handles requests for displaying patient overview
// will be implemented for D3
const getDataById = async(req, res, next) => {
    try {

        const patient = await Patient.findById(req.body.patient_id).lean()

        if (!patient) {
            // no patient found in database
            return res.render('notfound')
        }
        // found patient
        return res.render('oneData', { oneItem: patient})

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
        console.log(req.body.recordBCG.value)
        measurement = []

        measurement.push( [
            bcg = [
                maximium =req.body.BCGmax,
                minimum = req.body.BCGmin
            ]
        ])
        
        
        console.log(measurement)

        const newPatient = new Patient({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            screen_name: req.body.screen_name,
            dob: req.body.dob,
            bio: req.body.bio,
            engagement_rate: req.body.engagement_rate,
            meassurements: {
                bcg: {
                    minimum: req.body.BCGmin,
                    maximum: req.body.BCGmax
                }
            }
            
        })
        await newPatient.save(async function(err, newP){
            const newUser = new User({
                username: req.body.email,
                password: req.body.password,
                dob: req.body.dob,
                role: "patient",
                role_id: newP._id,
            })
            await newUser.save();
        });

        const patient = await Patient.find({screen_name:req.body.screen_name}).lean()


        return res.redirect('/clinician/dashboard')
    }catch (err) {
        return next(err)
    }
}

const getPatientMessages = async (req, res, next) => {
    try{

        patientComments = []

        measurement = await Measurement.find().sort({"date": -1}).lean()
        //console.log(measurement)

        if (!measurement) {
            return res.render('notfound')
        }

        for (let i = 0; i < measurement.length; i++){
            patient = await Patient.findById(measurement[i].patientId.toString()).lean()
            //console.log(patient.first_name)
            patientComments.push({
                patient: patient.first_name,
                id: measurement[i]._id,
                type: measurement[i].type,
                comment: measurement[i].comment,
                date: measurement[i].date
            })
        }

        //console.log(patientComments)
        return res.render('clinicianMessages', { data: patientComments})


    } catch(err){
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllPatientData,
    getDataById,
    insertData,
    getNewPatientForm,
    getPatientMessages
}