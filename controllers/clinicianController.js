const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const {User} = require('../models/user')
const { DateTime } = require("luxon");
const { Note } = require('../models/note');

const mType = {
    bcg: "bcg",
    weight: "weight",
    insulin: "insulin",
    exercise: "exercise",
};

function getDatesFromPatientObj(object) {
    var dates = [];
    for (let i = 0; i < object.length; i++) {
        dates.push(object[i].date);
    }
    return dates;
}

function groupMeasurementsByDate(measurements, dates) {
    const groupedData = {};

    for (i = 0; i < dates.length; i++) {
        var date = new Date(dates[i].getFullYear(), dates[i].getMonth(), dates[i].getDate(), 0, 0, 0);

        // if this date doesnt exist in the object, insert and initialize an empty dict.
        if (!(date in groupedData)) {
            groupData[date] = {};
        }

        for (j = 0; j < measurements.length; j++) {
            var mDate = new Date(measurements[i].date.getFullYear(), measurements[i].date.getMonth(), measurements[i].date.getDate(), 0, 0, 0);
            
            // add the measurement for this current data
            if (mDate == date) {
                groupedData[date][measurements[i].type] = measurements[i].value
            }
        }
    }
    return groupedData;
}

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


function getTableArray(dates, measurement) {
    const outputArray = []
    for (i in dates) {
        match = false
        for (j in measurement) {
            dataDate = new Date(measurement[j].date)
            dataDate.setUTCHours(0,0,0,0)
            if (dates[i].getTime() === dataDate.getTime()) {
                outputArray.push(measurement[j])
                match = true
                break
            } 
        }
        if (!match) {
            outputArray.push({date: dates[i], value: null})
        }
    }
    return outputArray
}

// function which handles requests for displaying patient name and measurement on clinician 
// dashboard finds the most recent measurement entered by a patient and displays it
// it is highlighted if its not in the safety threshold
const getAllPatientData = async (req, res, next) => {
    const patientDashboard = []
    const user = req.user 
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
        
        return res.render('clinicianDashboard', {layout: "clinician.hbs", loggedIn: req.isAuthenticated(), flash: req.flash('success'), user: user, data: patientDashboard, numPatients: patients.length, date: todaysDate})

    } catch (err) {
        return next(err)
    }
}

const writeNote = async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            // create the note and save to db
            const newNote = new Note({
                patientId: req.body.patientId,
                date: DateTime.now().setZone('Australia/Melbourne').toISO(),
                comment: req.body.comment
            });
            const patient_id = newNote.patientId
            await newNote.save();

            req.flash('success',"Notes updated.")

            res.redirect('/clinician/:patient_id') // potential error

        } catch(err) {
            next(err);
        }
    } else {
        res.render('login')
    }
}

const getPatientOverview = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const patient = await Patient.findById(req.params.patient_id).lean()
            const measurements = await Measurement.find({patientId: patient._id}).sort({"date": -1}).lean(); 
            const reqMeasurements = Object.keys(patient["measurements"])
            //const notes = await Note.find({patientId: patient._id}).sort({"date": -1}).lean();
            
            //return res.render('partials/patientOverview', {loggedIn: req.isAuthenticated(), required: reqMeasurements, patient: patient, measurements: measurements, notes: notes})
            return res.render('patientOverview', {loggedIn: req.isAuthenticated(), required: reqMeasurements, patient: patient, measurements: measurements})

        } catch (err) {
            return next(err)
        }
    } else {
        res.render('login');
    }
}
const getPatientBCG = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const patient = await Patient.findById(req.params.patient_id).lean()
            const dates = await getDatesInRange(new Date(patient.join_date), new Date())
            const measurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'bcg'}).sort({"date": -1}).lean() 
            const reqMeasurements = Object.keys(patient["measurements"])
            const type = 'bcg'
            const max = patient.measurements.bcg.maximum
            const min = patient.measurements.bcg.minimum
            const unit = '(nmol/L)'

            formatted = getTableArray(dates, measurement)

            if (!patient) {
                // no patient found in database
                return res.render('notfound')
            }

            return res.render('patientMeasurement', {loggedIn: req.isAuthenticated(), patient: patient, required: reqMeasurements, measurement: formatted, type: type, max: max, min: min, unit: unit})

        } catch (err) {
            return next(err)
        }
    } else {
        res.render('login');
    }
}
const getPatientWeight = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const patient = await Patient.findById(req.params.patient_id).lean()
            const dates = await getDatesInRange(new Date(patient.join_date), new Date())
            const measurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'weight'}).sort({"date": -1}).lean() 
            const reqMeasurements = Object.keys(patient["measurements"])
            const type = 'weight'
            const max = patient.measurements.weight.maximum
            const min = patient.measurements.weight.minimum
            const unit = '(kg)'

            formatted = getTableArray(dates, measurement)

            if (!patient) {
                // no patient found in database
                return res.render('notfound')
            }

            return res.render('patientMeasurement', {loggedIn: req.isAuthenticated(), patient: patient, required: reqMeasurements, measurement: formatted, type: type, max: max, min: min, unit: unit})

        } catch (err) {
            return next(err)
        }
    } else {
        res.render('login');
    }
}
const getPatientInsulin = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const patient = await Patient.findById(req.params.patient_id).lean()
            const dates = await getDatesInRange(new Date(patient.join_date), new Date())
            const measurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'insulin'}).sort({"date": -1}).lean() 
            const reqMeasurements = Object.keys(patient["measurements"])
            const type = 'insulin'
            const max = patient.measurements.insulin.maximum
            const min = patient.measurements.insulin.minimum
            const unit = '(dose(s))'

            formatted = getTableArray(dates, measurement)

            if (!patient) {
                // no patient found in database
                return res.render('notfound')
            }

            return res.render('patientMeasurement', {loggedIn: req.isAuthenticated(), patient: patient, required: reqMeasurements, measurement: formatted, type: type, max: max, min: min, unit: unit})

        } catch (err) {
            return next(err)
        }
    } else {
        res.render('login');
    }
}
const getPatientExercise = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const patient = await Patient.findById(req.params.patient_id).lean()
            const dates = await getDatesInRange(new Date(patient.join_date), new Date())
            const measurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'exercise'}).sort({"date": -1}).lean() 
            const reqMeasurements = Object.keys(patient["measurements"])
            const type = 'exercise'
            const max = patient.measurements.exercise.maximum
            const min = patient.measurements.exercise.minimum
            const unit = '(steps)'

            formatted = getTableArray(dates, measurement)

            if (!patient) {
                // no patient found in database
                return res.render('notfound')
            }

            return res.render('patientMeasurement', {loggedIn: req.isAuthenticated(), patient: patient, required: reqMeasurements, measurement: formatted, type: type, max: max, min: min, unit: unit})

        } catch (err) {
            return next(err)
        }
    } else {
        res.render('login');
    }
}

// function which handles requests for displaying the create form
// will be implemented for D3
const getNewPatientForm = async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            return res.render('newPatient', {layout: 'clinician.hbs', loggedIn: req.isAuthenticated()})
        } catch (err) {
            return next(err)
        }
    }
    else {
        res.render('login');
    } 
}

// function which handles requests for creating a new patient
// will be implemented for D3
const insertData = async (req, res, next) => {

    if (req.isAuthenticated()) {
        try {
            // first create the patient document and save to db
            const newPatient = new Patient({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                screen_name: req.body.screen_name,
                dob: req.body.dob,
                bio: req.body.bio,
                engagement_rate: 0,
                measurements: {}  
            });
            
            // extract the object id from the patient document
            const patient = await newPatient.save();  
            const patientId = patient._id;

            // then we create the user document and save to db
            const newUser = new User({
                username: req.body.email,
                password: req.body.password,
                dob: req.body.dob,
                role: "patient",
                role_id: patientId,
                theme: "default"
            });

            await newUser.save();

            // now we get the required measurements
            // and push it to the patient document.

            const required_measurements = [];

            if (req.body.bcg) {
                const thresholds = [];
                thresholds.push(req.body.bcg);
                if (req.body.bcgmin) {
                    thresholds.push(req.body.bcgmin)
                }
                if (req.body.bcgmax) {
                    thresholds.push(req.body.bcgmax)
                }
                required_measurements.push(thresholds)
            }
            
            if (req.body.weight) {
                const thresholds = [];
                thresholds.push(req.body.weight);
                if (req.body.weightmin) {
                    thresholds.push(req.body.weightmin)
                }
                if (req.body.weightmax) {
                    thresholds.push(req.body.weightmax)
                }
                required_measurements.push(thresholds)
            }
            
            if (req.body.insulin) {
                const thresholds = [];
                thresholds.push(req.body.insulin);
                if (req.body.insulinmin) {
                    thresholds.push(req.body.insulinmin)
                }
                if (req.body.insulinmax) {
                    thresholds.push(req.body.insulinmax)
                }
                required_measurements.push(thresholds)
            }
            
            if (req.body.exercise) {
                const thresholds = [];
                thresholds.push(req.body.exercise);
                if (req.body.exercisemin) {
                    thresholds.push(req.body.exercisemin)
                }
                if (req.body.exercisemax) {
                    thresholds.push(req.body.exercisemax)
                }
                required_measurements.push(thresholds)
            }

            var measurementJson = {}
            for (let i = 0; i < required_measurements.length; i++) {
                const measurement = required_measurements[i][0];
                const min = required_measurements[i][1];
                const max = required_measurements[i][2];

                measurementJson[measurement] = {minimum: min, maximum: max}
            }

            await Patient.findByIdAndUpdate(patientId, {measurements: measurementJson});
            req.flash('success', `Successfully created new patient.`)
            return res.redirect('/clinician/dashboard')
        }catch (err) {
            return next(err)
        }
    } else {
        res.render('login', {layout: 'clinician.hbs'});
    }   
}

const getPatientMessages = async (req, res, next) => {
    if (req.isAuthenticated()) {
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
            return res.render('clinicianMessages', { data: patientComments, layout:"clinician.hbs"})


        } catch(err){
            return next(err)
        }
    } else {
        res.render('login');
    } 
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllPatientData,
    getPatientOverview,
    getPatientBCG,
    getPatientWeight,
    getPatientInsulin,
    getPatientExercise,
    insertData,
    getNewPatientForm,
    getPatientMessages,
    writeNote,
}