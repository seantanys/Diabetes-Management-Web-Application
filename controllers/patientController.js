const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const { DateTime } = require("luxon");
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const e = require('connect-flash');
const { redirect } = require('express/lib/response');
const { body, validationResult } = require('express-validator')

// const { isAuthenticated } = require('../app.js');

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
            res.render('record.hbs', {loggedIn: req.isAuthenticated(), flash: req.flash('success'), title: "Record", theme: user.theme, singlePatient: data, measured: alreadyMeasured, 
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

const calcEngagementRate = async(req,res) => {
    const patientId = req.user.role_id;
    // get current melbourne time using luxon
    const currTime = DateTime.now().setZone('Australia/Melbourne');
    // get the beginning of the the current day
    const currDate = currTime.startOf('day').toISO();
    // get the patient's user data
    const userData = await User.find({role_id: patientId}).lean();
    // get the patient's data
    const patientData = await Patient.findById(patientId).lean();
    // get the patient's recorded data today
    const todayData = await Measurement.find({patientId: patientId, date: { $gte: currDate}}).lean();
    // get the measurments that have already been recorded for today
    const alreadyMeasured = getMeasurementTypes(todayData); 

    // checks if first measurement of the day
    if (alreadyMeasured.length == 0) {
        const currEngRate = patientData.engagement_rate
        const daysSinceJoined = currDate - userData.join_date
        const newEngRate = ((currEngRate * (daysSinceJoined - 1)) + 1) / daysSinceJoined
        patientData.engagement_rate = newEngRate
        await patientData.save();
    }
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
            // calcEngagementRate(id);
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
            res.render('patientDashboard.hbs', {loggedIn: req.isAuthenticated(), title: "Dashboard", theme: user.theme, dob, singlePatient: data, measured: alreadyMeasured, notMeasured: notMeasured, required: reqMeasurements})
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
            res.render('account', {loggedIn: req.isAuthenticated(), flash: req.flash('success'), errorFlash: req.flash('error'), title: "Account", age: age.toString(), singlePatient: data, theme: user.theme})
        } else {
            res.render('notfound')
        }
    }
    else {
        res.render('login')
    }
}

const changePassword = async (req, res) => {

    if (req.isAuthenticated()) {
        const user = req.user;
        const pw = req.body.curr_pw
        const new_pw = req.body.new_pw
        const confirm_pw = req.body.confirm_new_pw

        // const errors = validationResult(req); 
        // if (!errors.isEmpty()) {
        //     console.log(errors);
        //     req.flash('error', `Password Validation Failed. Please try Again.`)
        //     return res.redirect('/patient/account');
        // }

        const retrieved_user = await User.findById(user._id)

        if (new_pw !== confirm_pw) {
            req.flash('error', `Passwords do not match`)
            return res.redirect('/patient/account');
        }
        if ((new_pw.length < 8) || (confirm_pw.length < 8)) {
            req.flash('error', `Passwords must be at least 8 characters long!`)
            return res.redirect('/patient/account');
        }

        retrieved_user.verifyPassword(pw, async (err, valid) => {
            if (!err) {
                // if the password matches
                if (valid) {
                    if (pw === new_pw) {
                        req.flash('error', 'New password cannot be the same as your current password.')
                        res.redirect('/patient/account');
                    }
                    else {
                        retrieved_user.password = new_pw;
                        await retrieved_user.save();
                        req.flash('success', 'Password Successfully Changed.')
                        res.redirect('/patient/account');
                    }
                } else {
                    req.flash('error', 'Password is incorrect. Try again.')
                    res.redirect('/patient/account');
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
        const measurements = await Measurement.find({patientId: user.role_id}).sort({"date": 1}).lean(); 
        const data = await Patient.findById(user.role_id).lean(); 
        const reqMeasurements = Object.keys(data["measurements"])

        // group measurements by date to be used in chart.
        const measurementsByDate = groupMeasurementsByDate(measurements);

        // convert dates to more readable format.
        for (let i = 0; i < measurements.length; i++) {
            var convertedDate = measurements[i].date;
            measurements[i].date = convertedDate.toLocaleString(DateTime.DATETIME_MED);
        }

        res.render('patientData', {loggedIn: req.isAuthenticated(), title: "Your Data", theme: user.theme, required: reqMeasurements, measurement: measurements, groupedByDate: measurementsByDate});
    }
    else {
        res.render('login');
    }
}

// this function aggragates measurements by date, mainly used for charts
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

// exports an object, which contain functions imported by router
module.exports = {
    getMeasurementPage,
    submitMeasurement,
    getPatientPage,
    redirectToDashboard,    
    getPatientAccountPage,
    changePassword,
    changeTheme,
    getPatientDataPage,
}
