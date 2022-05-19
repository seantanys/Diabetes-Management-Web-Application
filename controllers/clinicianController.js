const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const {User} = require('../models/user')
const { DateTime } = require("luxon");
const {Clinician} = require('../models/clinician')
const { body, validationResult } = require('express-validator')

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
            bcgmeasurement = await Measurement.findOne({patientId: clinician.patients[i].toString(), type:'bcg'}).sort({"date": -1}).lean()
            weightmeasurement = await Measurement.findOne({patientId: clinician.patients[i].toString(), type:'weight'}).sort({"date": -1}).lean()
            insulinmeasurement = await Measurement.findOne({patientId: clinician.patients[i].toString(), type:'insulin'}).sort({"date": -1}).lean()
            exercisemeasurement = await Measurement.findOne({patientId: clinician.patients[i].toString(), type:'exercise'}).sort({"date": -1}).lean()

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

// function which handles requests for displaying patient overview
// will be implemented for D3
const getDataById = async(req, res, next) => {
    if (req.isAuthenticated()) {
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
            if (!errors.isEmpty()) {
              res.send(errors);
              //req.flash('error', `Something went wrong when creating a patient, please try again.`)
              //return res.redirect('/clinician/create');
            }

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

            const user = req.user
            const clinician = await Clinician.findById(user.role_id.toString()).lean()
            console.log(clinician.patients)
            clinician.patients.push(patientId.toString())
            await Clinician.findByIdAndUpdate(user.role_id.toString(), {patients: clinician.patients});
            console.log(clinician.patients)

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
                        id: measurement[i]._id,
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
            body('first_name', 'first_name doesnt exists').exists().isAlphanumeric().escape(),
            body('last_name', 'last_name doesnt exists').exists().isAlphanumeric().escape(),
            body('screen_name', 'screen_name doesnt exists').exists().escape(),
            body('email', 'Invalid email').exists().isEmail().escape(),
            body('password', 'password doesnt exist').exists().isLength({min:8}).escape(),//isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1}),
            body('dob', 'userName doesnt exist').exists().isDate().escape(),
            body('bio', 'bio doesnt exist').exists().escape(),
            //body('bcg', 'invalid bcg checkbox').exists().isIn(['checked', 'unchecked']),
            // body('bcgmin','invalid bcg min').optional().isFloat().escape(),
            // body('bcgmax','invalid bcg max').optional().isFloat().escape(),
            //body('weight', 'invalid weight checkbox').exists().isIn(['checked', 'unchecked']),
            // body('weightmin','invalid weight min').optional().isFloat().escape(),
            // body('weightmax','invalid weight max').optional().isFloat().escape(),
            //body('insulin', 'invalid insulin checkbox').exists().isIn(['checked', 'unchecked']),
            // body('insulinmin','invalid insulin min').optional().isFloat().escape(),
            // body('insulinmax','invalid insulin max').optional().isFloat().escape(),
            //body('exercise', 'invalid exercise checkbox').exists().isIn(['checked', 'unchecked']),
            // body('exercisemin','invalid exercise min').optional().isFloat().escape(),
            // body('exercisemax','invalid exercise max').optional().isFloat().escape(),
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
    getDataById,
    insertData,
    getNewPatientForm,
    getPatientComments,
    getAccountPage,
    changePassword,
    changeSupportMessage,
    getSupportMessagesPage,
    validate
}