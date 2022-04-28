const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')

const getAllPatientData = async (req, res, next) => {
    const patientDashboard = []
    const patientIds = []
    const currentTime = new Date()
    currentTime.setHours(0, 0, 0);
    const todaysDate= currentTime.getDate().toString()+"/"+currentTime.getMonth().toString()+"/"+currentTime.getFullYear().toString();

    try {
        const patients = await Patient.find().lean()
        for (let i = 0; i < patients.length; i++) {
            patientIds.push([patients[i]._id.toString(), patients[i].first_name.toString()+" "+patients[i].last_name.toString()]);
        }

        for (let i = 0; i < patientIds.length; i++) {

            bcgmeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'bcg'}).sort({"date": -1}).lean()
            weightmeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'weight'}).sort({"date": -1}).lean()
            insulinmeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'insulin'}).sort({"date": -1}).lean()
            exercisemeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'exercise'}).sort({"date": -1}).lean()

            patientDashboard.push({patient: patients[i],bcg: (bcgmeasurement)?bcgmeasurement['value']:"",
            weight: (weightmeasurement)?weightmeasurement['value']:"",insulin: (insulinmeasurement)?insulinmeasurement['value']:"",
            exercise: (exercisemeasurement)?exercisemeasurement['value']:""})

        }
        return res.render('clinicianDashboard', { layout: "clinician.hbs", data: patientDashboard, numPatients: patients.length, date: todaysDate})
    } catch (err) {
        return next(err)
    }
}

const getDataById = async(req, res, next) => {
    try {

        const patient = await Patient.findById(req.body.patient_id).lean()

        if (!patient) {
            // no author found in database
            return res.render('notfound')
        }
        // found person
        return res.render('oneData', { oneItem: patient})

    } catch (err) {
        return next(err)
    }
}

const getNewPatientForm = async (req, res, next) => {
    try {
        return res.render('newPatient')
    } catch (err) {
        return next(err)
    }
}

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
            // measurement:{
            //     type: "BCG",
            //     value: 404,
            //     comment: "today i recorded 404 error ",
            //   },
        })
        await newPatient.save();
        return res.redirect('/clinician/dashboard')
    }catch (err) {
        return next(err)
    }
}

module.exports = {
    getAllPatientData,
    getDataById,
    insertData,
    getNewPatientForm
}