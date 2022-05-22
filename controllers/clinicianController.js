const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const {User} = require('../models/user')
const { DateTime } = require("luxon");
const {Clinician} = require('../models/clinician')
const { body, check, validationResult } = require('express-validator')
const { Note } = require('../models/note');


function getDatesFromPatientObj(object) {
    var dates = [];
    for (let i = 0; i < object.length; i++) {
        dates.push(object[i].date);
    }
    return dates;
}

// function groupMeasurementsByDate(measurements, dates) {
//     const groupedData = {};

//     for (i = 0; i < dates.length; i++) {
//         var date = new Date(dates[i].getFullYear(), dates[i].getMonth(), dates[i].getDate(), 0, 0, 0);

//         // if this date doesnt exist in the object, insert and initialize an empty dict.
//         if (!(date in groupedData)) {
//             groupData[date] = {};
//         }

//         for (j = 0; j < measurements.length; j++) {
//             var mDate = new Date(measurements[i].date.getFullYear(), measurements[i].date.getMonth(), measurements[i].date.getDate(), 0, 0, 0);
            
//             // add the measurement for this current data
//             if (mDate == date) {
//                 groupedData[date][measurements[i].type] = measurements[i].value
//             }
//         }
//     }
//     return groupedData;
// }

function groupMeasurementsByDate(measurements) {
    const groupedData = {};

    for (let i = 0; i < measurements.length; i++) {
        var time = new Date(measurements[i].date.getFullYear(), measurements[i].date.getMonth(), measurements[i].date.getDate(), 0, 0, 0);

        // if this date doesnt exist in the object, insert and initialize an empty dict.
        if (!(time in groupedData)) {
            groupedData[time] = {};
        }

        // add the measurement for this current data
        groupedData[time][measurements[i].type] = measurements[i].value
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

    const joinDate = new Date(startDate);
    joinDate.setUTCHours(0,0,0,0);
    dates.push(new Date(joinDate));
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

    const clinician = await Clinician.findById(user.role_id.toString()).lean();

    try {
        // for each patient in the Patients collection, we search for their latest measurements within the
        // Measurements collection and store it in the patient dashboard list which is sent to the 
        // clinician dashboard handlebar, along with the total number of patients for that clinician 
        // and todays date
        
        for (let i = 0; i < clinician.patients.length; i++) {

            const patient = await Patient.findById(clinician.patients[i].toString()).lean()

            bcgmeasurement = await Measurement.findOne({patientId: clinician.patients[i].toString(), type:'bcg', date: { $gte: currDate}}).lean()
            weightmeasurement = await Measurement.findOne({patientId: clinician.patients[i].toString(), type:'weight', date: { $gte: currDate}}).lean()
            insulinmeasurement = await Measurement.findOne({patientId: clinician.patients[i].toString(), type:'insulin', date: { $gte: currDate}}).lean()
            exercisemeasurement = await Measurement.findOne({patientId: clinician.patients[i].toString(), type:'exercise', date: { $gte: currDate}}).lean()

            patientDashboard.push({
                                   patient: patient,
                                   bcg: (bcgmeasurement)?bcgmeasurement['value']:"",
                                   weight: (weightmeasurement)?weightmeasurement['value']:"",
                                   insulin: (insulinmeasurement)?insulinmeasurement['value']:"",
                                   exercise: (exercisemeasurement)?exercisemeasurement['value']:""
                                })
        }
        
        return res.render('clinicianDashboard', {layout: "clinician.hbs", loggedIn: req.isAuthenticated(), flash: req.flash('success'), errorFlash: req.flash('error'), user: clinician, data: patientDashboard, numPatients: clinician.patients.length, date: todaysDate})

    } catch (err) {
        return next(err)
    }
}

const writeNote = async (req, res) => {
    if (req.isAuthenticated()) {

        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            req.flash('error', `Something went wrong, please enter a valid note and try again.`)
            return res.redirect(`/clinician/manage-patient/${req.body.pid}`);
        }

        try {
            if (!(req.body.pid) || !(req.body.comment)) {
                req.flash('error',"Error. Please fill out the required fields to add a note.")
                return res.redirect(`/clinician/manage-patient/${req.body.pid}`);
            }

            const patientExists = await Patient.findById(req.body.pid).lean();

            if (!(patientExists)) {
                req.flash('error',"Error. Something Went Wrong. Please try again.")
                return res.redirect(`/clinician/manage-patient/${req.body.pid}`);
            }

            // create the note and save to db
            const newNote = new Note({
                patientId: req.body.pid,
                date: DateTime.now().setZone('Australia/Melbourne').toISO(),
                comment: req.body.comment,
                color: req.body.notecolor,
            });
            await newNote.save();

            req.flash('success',"Note successfully added!")
            res.redirect(`/clinician/manage-patient/${req.body.pid}`);

        } catch(err) {
            console.log(err);
            req.flash('error',"Error Adding Note. Please Try Again")
            res.redirect(`/clinician/manage-patient/${req.body.pid}`);
        }
    } else {
        res.render('login')
    }
}

const deleteNote = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const patientId = req.body.pid
            const noteId = req.body.nid

            await Note.deleteOne({_id: noteId}, function (err) {
                if (err) {
                    req.flash('error',"Something went wrong deleting the note. Please try again.");
                    return res.redirect(`/clinician/manage-patient/${patientId}`);
                }
            }).clone()

            req.flash('success',"Notes updated.")
            res.redirect(`/clinician/manage-patient/${patientId}`);

        } catch(err) {
            console.log(err);
        }
    } else {
        res.render('login')
    }
}

const getPatientOverview = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const patient = await Patient.findById(req.params.patient_id).lean()
            const user = await User.findOne({role_id: patient._id}).lean();
            const measurements = await Measurement.find({patientId: patient._id}).sort({"date": -1}).lean(); 
            const reqMeasurements = Object.keys(patient["measurements"])
            const notes = await Note.find({patientId: patient._id}).sort({"date": -1}).lean();

            const measurementsForChart = await Measurement.find({patientId: patient._id}).sort({"date": 1}).lean(); 
            const measurementsByDate = groupMeasurementsByDate(measurementsForChart);
            
            //return res.render('partials/patientOverview', {loggedIn: req.isAuthenticated(), required: reqMeasurements, patient: patient, measurements: measurements, notes: notes})
            return res.render('patientOverview', {loggedIn: req.isAuthenticated(), flash: req.flash('success'), errorFlash: req.flash('error'), layout: 'clinician.hbs', required: reqMeasurements, join_date: user.join_date, patient: patient, measurements: measurements, groupedByDate: measurementsByDate, notes: notes})

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
            const user = await User.findOne({role_id: patient._id}).lean();
            const dates = await getDatesInRange(new Date(user.join_date), new Date())
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

            return res.render('patientMeasurement', {loggedIn: req.isAuthenticated(), layout: 'clinician.hbs', join_date: user.join_date, patient: patient, required: reqMeasurements, measurement: formatted, type: type, max: max, min: min, unit: unit})

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
            const user = await User.findOne({role_id: patient._id}).lean();
            const dates = await getDatesInRange(new Date(user.join_date), new Date())

            const measurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'weight'}).sort({"date": -1}).lean() 
            const reqMeasurements = Object.keys(patient["measurements"])
            const type = 'weight'
            const max = patient.measurements.weight.maximum
            const min = patient.measurements.weight.minimum
            console.log(max)
            console.log(min)
            const unit = '(kg)'

            formatted = getTableArray(dates, measurement)

            if (!patient) {
                // no patient found in database
                return res.render('notfound')
            }

            return res.render('patientMeasurement', {loggedIn: req.isAuthenticated(), layout: 'clinician.hbs', join_date: user.join_date, patient: patient, required: reqMeasurements, measurement: formatted, type: type, max: max, min: min, unit: unit})

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
            const user = await User.findOne({role_id: patient._id}).lean();
            const dates = await getDatesInRange(new Date(user.join_date), new Date())
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

            return res.render('patientMeasurement', {loggedIn: req.isAuthenticated(), layout: 'clinician.hbs', join_date: user.join_date, patient: patient, required: reqMeasurements, measurement: formatted, type: type, max: max, min: min, unit: unit})

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
            const user = await User.findOne({role_id: patient._id}).lean();
            const dates = await getDatesInRange(new Date(user.join_date), new Date())
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

            return res.render('patientMeasurement', {loggedIn: req.isAuthenticated(), layout: 'clinician.hbs', join_date: user.join_date, patient: patient, required: reqMeasurements, measurement: formatted, type: type, max: max, min: min, unit: unit})

        } catch (err) {
            return next(err)
        }
    } else {
        res.render('login');
    }
}

const getDataBounds = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const patient = await Patient.findById(req.params.patient_id).lean()
            const measurement = await Measurement.find({patientId: req.params.patient_id.toString()})
            const reqMeasurements = Object.keys(patient["measurements"])
            
            res.render('clinicianManage', {layout: 'clinician.hbs', loggedIn: req.isAuthenticated(), flash: req.flash('success'), errorFlash: req.flash('error'), join_date: user.join_date, patient: patient, required: reqMeasurements})
            
        } catch (err) {
            return next(err)
        }
    } else {
        res.render('login');
    }
}

const manageDataBounds = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const patientId = req.params.patient_id;
            const minbcg = req.body.minbcg;
            const maxbcg = req.body.maxbcg;
            const minweight = req.body.minweight;
            const maxweight = req.body.maxweight;
            const mindose = req.body.mindose;
            const maxdose = req.body.maxdose;
            const minsteps = req.body.minsteps;
            const maxsteps = req.body.maxsteps;

            const required_measurements = [];

            if (req.body.bcg) {

                if(parseInt(minbcg)>=parseInt(maxbcg)){
                    req.flash('error', 'Error. Blood Glucose minimum threshold must not be equal to or exceeding maximum threshold.')
                    return res.redirect(`/clinician/manage-patient/${patientId}/manage`)
                }

                const thresholds = [];
                thresholds.push('bcg');
                if (minbcg) {
                    thresholds.push(minbcg)
                }
                if (maxbcg) {
                    thresholds.push(maxbcg)
                }
                required_measurements.push(thresholds)
            }
            
            if (req.body.weight) {

                if(parseInt(minweight)>=parseInt(maxweight)){
                    req.flash('error', 'Error. Weight minimum threshold must not be equal to or exceeding maximum threshold.')
                    return res.redirect(`/clinician/manage-patient/${patientId}/manage`)
                }

                const thresholds = [];
                thresholds.push('weight');
                if (minweight) {
                    thresholds.push(minweight)
                }
                if (maxweight) {
                    thresholds.push(maxweight)
                }
                required_measurements.push(thresholds)
            }
            
            if (req.body.insulin) {

                if(parseInt(mindose)>=parseInt(maxdose)){
                    req.flash('error', 'Error. Insulin dose minimum threshold must not be equal to or exceeding maximum threshold.')
                    return res.redirect(`/clinician/manage-patient/${patientId}/manage`)
                }

                const thresholds = [];
                thresholds.push('insulin');
                if (mindose) {
                    thresholds.push(mindose)
                }
                if (maxdose) {
                    thresholds.push(maxdose)
                }
                required_measurements.push(thresholds)
            }
            
            if (req.body.exercise) {

                if(parseInt(minsteps)>=parseInt(maxsteps)){
                    req.flash('error', 'Error. Exercise minimum threshold must not be equal to or exceeding maximum threshold.')
                    return res.redirect(`/clinician/manage-patient/${patientId}/manage`)
                }

                const thresholds = [];
                thresholds.push('exercise');
                if (minsteps) {
                    thresholds.push(minsteps)
                }
                if (maxsteps) {
                    thresholds.push(maxsteps)
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

            // await Patient.updateOne({_id: recipientId}, {$set:{minbcg:minbcg}});
            req.flash('success', 'Measurement thresholds successfully updated!')
            res.redirect(`/clinician/manage-patient/${patientId}/manage`)
            
            
        
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
            return res.render('newPatient', {layout: 'clinician.hbs', errorFlash: req.flash('error'), loggedIn: req.isAuthenticated()})
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
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req); 
            const user = req.user
            if (!errors.isEmpty()) {
              console.log(errors);
              req.flash('error', `Something went wrong when creating a patient, please try again.`)
              return res.redirect('/clinician/create');
            }

            console.log(req)

            // checking to see if this email is taken.
            // const emailExists = await User.find({username: req.body.email}).lean();
            // if (emailExists.length > 0) {
            //     req.flash('error', `The email address has already been taken, please try another one.`)
            //     return res.redirect('/clinician/create');
            // }

            // const screenNameExists = await Patient.find({screen_name: req.body.screen_name}).lean();

            // if (screenNameExists) {
            //     req.flash('error', `This screen name has already been taken, please try another one.`)
            //     return res.redirect('/clinician/create');
            // }

            // first create the patient document and save to db
            const newPatient = new Patient({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                screen_name: req.body.screen_name,
                dob: req.body.dob,
                bio: req.body.bio,
                engagement_rate: 0,
                clinicanId: user.role_id.toString(),
                measurements: {}  
            });
            
            // extract the object id from the patient document
            const patient = await newPatient.save();  
            const patientId = patient._id;

            // then we create the user document and save to db
            const newUser = new User({
                username: req.body.email,
                password: req.body.password,
                role: "patient",
                role_id: patientId,
                theme: "default"
            });

            await newUser.save();

            
            const clinician = await Clinician.findById(user.role_id.toString()).lean()
            clinician.patients.push(patientId.toString())
            await Clinician.findByIdAndUpdate(user.role_id.toString(), {patients: clinician.patients});

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

const getPatientComments = async (req, res, next) => {
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
                if (measurement[i].comment != ""){
                    patientComments.push({
                        patient: patient.first_name+" "+ patient.last_name,
                        id: measurement[i].patientId,
                        type: measurement[i].type,
                        value: measurement[i].value,
                        comment: measurement[i].comment,
                        date: measurement[i].date.toLocaleString("en-US", {timeZone: "Australia/Sydney"}),
                    })
                }
            }
    
            //console.log(patientComments)
            return res.render('patientComments', {layout: "clinician.hbs", loggedIn: req.isAuthenticated(), data: patientComments})
    
    
        } catch(err){
            return next(err)
        }
    } else {
        res.render('login');
    } 
}

const getSupportMessagesPage = async (req, res, next) => {

    if (req.isAuthenticated()) {
        try {
            const user = req.user;
            const clinician = await Clinician.findById(user.role_id.toString()).lean();
            const messages = {}

            for (let i = 0; i < clinician.patients.length; i++) {
                const patient = await Patient.findById(clinician.patients[i].toString()).lean()
                var patientFullName = `${patient.first_name} ${patient.last_name}`;

                messages[patientFullName] = [patient._id.toString(), patient.supportMessage];
            }

            res.render('clinicianSupportMessage', {layout: "clinician.hbs", loggedIn: req.isAuthenticated(), flash: req.flash('success'), errorFlash: req.flash('error'), clinician: clinician, messages: messages});

        } catch (err) {
            return next(err);
        }

        
    } else {
        res.render('login');
    }
}

const getIndividualMessage = async (req, res) => {
    if (req.isAuthenticated()) {

        try {
            const user = req.user;
            const patient = await Patient.findById(req.params.patient_id).lean()
            const clinician = await Clinician.findById(user.role_id.toString()).lean();
            const measurement = await Measurement.find({patientId: req.params.patient_id.toString(), type:'insulin'}).sort({"date": -1}).lean() 
            const reqMeasurements = Object.keys(patient["measurements"])
            const message = patient.supportMessage;

            res.render('individualSupportMessage', {layout: "clinician.hbs", loggedIn: req.isAuthenticated(), flash: req.flash('success'), errorFlash: req.flash('error'),
                                                    patient: patient, join_date: user.join_date, clinician: clinician, message: message,
                                                    required: reqMeasurements});

        } catch (err) {
            return next(err);
        }


    } else {
        res.render('login');
    }
}

const changeIndividualMessage = async(req, res, next) =>{

    if (req.isAuthenticated()) {
        try{
            const message = req.body.supportMsg;
            const recipientId = req.body.recipientId;

            if (message.length <= 3) {
                req.flash('error', 'Error. Support message must be longer.')
                return res.redirect('/clinician/messages')
            }
            if (recipientId.length <= 10) {
                req.flash('error', 'Something went wrong processing your message. Please Try Again.')
                return res.redirect('/clinician/messages')
            }

            await Patient.updateOne({_id: recipientId}, {$set: {supportMessage: message}});

            req.flash('success', 'Support message successfully updated!')
            res.redirect(`/clinician/manage-patient/${recipientId}/message`)
        }catch(err){
            return next(err);
        }
    } else {
        res.render('login');
    }
}

const changeSupportMessage = async(req, res, next) =>{

    if (req.isAuthenticated()) {
        try{
            const message = req.body.supportMsg;
            const recipientId = req.body.recipientId;

            if (message.length <= 3) {
                req.flash('error', 'Error. Support message must be longer.')
                return res.redirect('/clinician/messages')
            }
            if (recipientId.length <= 10) {
                req.flash('error', 'Something went wrong processing your message. Please Try Again.')
                return res.redirect('/clinician/messages')
            }

            await Patient.updateOne({_id: recipientId}, {$set: {supportMessage: message}});

            req.flash('success', 'Support message successfully updated!')
            res.redirect('/clinician/messages')
        }catch(err){
            return next(err);
        }
    } else {
        res.render('login');
    }
}

const getAccountPage = async (req, res) => {
    if (req.isAuthenticated()) {
        res.render('clinicianAccount.hbs', {layout:"clinician.hbs", loggedIn: req.isAuthenticated(), flash: req.flash('success'), errorFlash: req.flash('error')});
    } else {
        res.render('login');
	}
}

const changePassword = async (req, res) => {

    if (req.isAuthenticated()) {

        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            req.flash('error', `${errors.array()[0].msg}`)
            return res.redirect('/clinician/account');
        }

        const user = req.user;
        const pw = req.body.curr_pw
        const new_pw = req.body.new_pw
        const confirm_pw = req.body.confirm_new_pw

        const retrieved_user = await User.findById(user._id)

        if (new_pw !== confirm_pw) {
            req.flash('error', `Passwords do not match`)
            res.redirect('/clinician/account');
        }
        if ((new_pw.length < 8) || (confirm_pw.length < 8)) {
            req.flash('error', `Passwords must be at least 8 characters long!`)
            res.redirect('/clinician/account');
        }

        retrieved_user.verifyPassword(pw, async (err, valid) => {
            if (!err) {
                // if the password matches
                if (valid) {
                    if (pw === new_pw) {
                        req.flash('error', 'New password cannot be the same as your current password.')
                        res.redirect('/clinician/account');
                    }
                    else {
                        retrieved_user.password = new_pw;
                        await retrieved_user.save();
                        req.flash('success', 'Password Successfully Changed.')
                        res.redirect('/clinician/account');
                    }
                } else {
                    req.flash('error', 'Password is incorrect. Try again.')
                    res.redirect('/clinician/account');
                }
            } else {
                res.send(err);
            }
        });
    }
    else {
        res.render('login');
    }
}

const validate = (method) =>{
    switch (method) {
        case 'insertData': {
         return [ 
            body('first_name', 'first_name invalid').exists().isAlphanumeric().escape(),
            body('last_name', 'last_name invalid').exists().isAlphanumeric().escape(),
            body('screen_name', 'screen_name invalid').exists().escape(),
            body('email', 'Invalid email').exists().isEmail().escape(),
            body('password', 'password invalid').exists().isLength({min:8}).escape(),//isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1}),
            body('dob', 'userName invalid').exists().isDate().escape(),
            body('bio', 'bio invalid').exists().escape(),
            //body('bcg', 'invalid bcg checkbox').exists().isIn(['checked', 'unchecked']),
            body('bcgmin','invalid bcg min').optional({checkFalsy: true}).isFloat().escape(),
            body('bcgmax','invalid bcg max').optional({checkFalsy: true}).isFloat().escape(),
            //body('weight', 'invalid weight checkbox').exists().isIn(['checked', 'unchecked']),
            body('weightmin','invalid weight min').optional({checkFalsy: true}).isFloat().escape(),
            body('weightmax','invalid weight max').optional({checkFalsy: true}).isFloat().escape(),
            //body('insulin', 'invalid insulin checkbox').exists().isIn(['checked', 'unchecked']),
            body('insulinmin','invalid insulin min').optional({checkFalsy: true}).isFloat().escape(),
            body('insulinmax','invalid insulin max').optional({checkFalsy: true}).isFloat().escape(),
            //body('exercise', 'invalid exercise checkbox').exists().isIn(['checked', 'unchecked']),
            body('exercisemin','invalid exercise min').optional({checkFalsy: true}).isFloat().escape(),
            body('exercisemax','invalid exercise max').optional({checkFalsy: true}).isFloat().escape(),
            ]   
        }
        case 'changePassword': {
            return [
                    body("new_pw", "invalid password")
                        .isLength({ min: 8 })
                        .custom((value,{req, loc, path}) => {
                            if (value !== req.body.confirm_new_pw) {
                                // trow error if passwords do not match
                                throw new Error("Passwords don't match");
                            } else {
                                return value;
                            }
                        })
                    ]   
        }
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
    getDataBounds,
    manageDataBounds,
    insertData,
    getNewPatientForm,
    getPatientComments,
    getAccountPage,
    changePassword,
    changeSupportMessage,
    getSupportMessagesPage,
    getIndividualMessage,
    changeIndividualMessage,
    validate,
    writeNote,
    deleteNote
}