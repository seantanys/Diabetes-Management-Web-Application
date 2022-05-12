const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const { DateTime } = require("luxon");
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const e = require('connect-flash');

// const { isAuthenticated } = require('../app.js');

// hard coded Patient Pat's id for D2
// const id = "62660737332717bb9fe3eb55"; 

const getMeasurementPage = async (req, res) => {

    if (req.isAuthenticated()) {
        // get logged in user id
        const user = req.user 
        // get current melbourne time using luxon
        const currTime = DateTime.now().setZone('Australia/Melbourne');
        // get the beginning of the the current day
        const currDate = currTime.startOf('day').toISO();
        const displayTime = currTime.toLocaleString(DateTime.DATETIME_MED)
        // get the patient's data
        const data = await Patient.findById(user.role_id).lean();
        // get the patient's recorded data today
        const todayData = await Measurement.find({patientId: user.role_id, date: { $gte: currDate}}).lean();

        // get the patients required measurements.
        const reqMeasurements = Object.keys(data["measurements"]) 
        // get the measurments that have already been recorded for today
        const alreadyMeasured = getMeasurementTypes(todayData); 
        // get the measurements that havent been recorded today
        const notMeasured = reqMeasurements.filter(x => !alreadyMeasured.includes(x)); 

        if (data) {
            res.render('record.hbs', {loggedIn: req.isAuthenticated(), flash: req.flash('success'), theme: user.theme, singlePatient: data, measured: alreadyMeasured, 
                                    notMeasured: notMeasured, required: reqMeasurements,
                                    currentTime: displayTime})
        } else {
            console.log("patient data not found")
            res.render('notfound')
        }
    }
    else {
        res.render('login');
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
const submitMeasurement = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const id = req.user.role_id
        try {
            const newMeasurement = new Measurement ({
                type: req.body.type,
                patientId: id,
                value: parseFloat(req.body.value),
                date: DateTime.now().setZone('Australia/Melbourne').toISO(),
                comment: req.body.comment,
            })
            await newMeasurement.save();
            // console.log("Measurement successfully saved to db")
            if (req.body.type === "bcg") {
                req.flash('success', "blood glucose level successfully recorded.")
            }
            else {
                req.flash('success', `${req.body.type} successfully recorded.`)
            }
            
            res.redirect('/patient/record');
        } catch (err) {
            next(err);
        }
    }
    else {
        res.render('login');
    }
}

// this function renders the patient dashboard page
const getPatientPage = async (req, res) => {

    if (req.isAuthenticated()) {
        const user = req.user 
        const currTime = DateTime.now().setZone('Australia/Melbourne'); 
        const currDate = currTime.startOf('day').toISO();
        // get the patient's data
        const data = await Patient.findById(user.role_id).lean(); 
        // get the patient's recorded data today
        const todayData = await Measurement.find({patientId: user.role_id, date: { $gte: currDate}}).lean(); 

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
            res.render('patientDashboard.hbs', {loggedIn: req.isAuthenticated(), theme: user.theme, dob, singlePatient: data, measured: alreadyMeasured, notMeasured: notMeasured, required: reqMeasurements})
        } else {
            console.log("patient data not found")
            res.render('notfound')
        }
    }
    else {
        res.render('login')
    }
}

const redirectToDashboard = async (req, res) => {
    res.redirect('/patient/dashboard');
}

const getPatientAccountPage = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user 
        // get the patient's data
        const data = await Patient.findById(user.role_id).lean(); 
        const currTime = DateTime.now().setZone('Australia/Melbourne'); 

        // format the date for presentation
        const dob = data.dob.getDate().toString().padStart(2,"0") + "/" + 
            (data.dob.getMonth() + 1).toString().padStart(2,"0") + "/" + data.dob.getFullYear().toString()

        const age = currTime.year - data.dob.getFullYear()

        if (data) {
            res.render('account', {loggedIn: req.isAuthenticated(), flash: req.flash('success'), age: age.toString(), singlePatient: data, theme: user.theme})
        } else {
            res.render('notfound')
        }
    }
    else {
        res.render('login')
    }
}

const SALT_FACTOR = 10

const changePassword = async (req, res) => {

    if (req.isAuthenticated()) {
        const user = req.user;
        const pw = req.body.curr_pw
        const new_pw = req.body.new_pw
        const confirm_pw = req.body.confirm_new_pw

        const retrieved_user = await User.findById(user._id)

        // if (retrieved_user) {
        //     if (retrieved_user.authenticate(pw)) {
        //         if (new_pw === confirm_pw) {
        //             res.send("password changed")
        //         }
        //         else {
        //             res.send("passwords do not match")
        //         }
        //     }
        //     else {
        //         res.send("old password is wrong")
        //     }
        // }

        retrieved_user.changePassword(pw, new_pw, function (err) {
            if (!err) {
                res.send("worked")
            }
            else {
                res.send(err)
            }
        })
    }
    else {
        res.render('login');
    }
}

const changeTheme = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user
        const retrieved_user = await User.findById(user._id)
        retrieved_user.theme = req.body.theme

        try {
            await retrieved_user.save()
            req.flash('success', `Successfully changed to ${req.body.theme} theme.`)
            res.redirect('/patient/account');
        }
        catch (err) {
            console.log(err)
        }
    }
    else {
        res.render('login');
    }
}

const getPatientDataPage = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        res.render('patientData', {loggedIn: req.isAuthenticated()});
    }
    else {
        res.render('login');
    }
}


// exports an object, which contain functions imported by router
module.exports = {
    getMeasurementPage,
    submitMeasurement,
    getPatientPage,
    redirectToDashboard,    
    getPatientAccountPage,
    changePassword,
    changeTheme,
    getPatientDataPage
}
