const {Patient} = require('../models/patient')
const {Measurement} = require('../models/measurement')
const {User} = require('../models/user')
const { DateTime } = require("luxon");

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

const getPatientById = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {

            const patient = await Patient.findById(req.params.patient_id).lean()
            const measurements = await Measurement.find({patientId: patient._id}).sort({"date": -1}).lean(); 
            const reqMeasurements = Object.keys(patient["measurements"])
            const dates = await getDatesInRange(new Date(patient.join_date), new Date())

            for (let i = 0; i < measurements.length; i++) {
                var convertedDate = measurements[i].date;
                //measurements[i].date = convertedDate.toLocaleString(DateTime.DATETIME_MED);
            }

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
                // not required imput
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
                            tempArray.push({date: dates[i], value: null})
                        }
                    }
                mTrend.push(tempArray)
                
                }
            }

            if (!patient) {
                // no patient found in database
                return res.render('notfound')
            }

            bcg = mTrend[0]
            weight = mTrend[1]
            insulin = mTrend[2]
            exercise = mTrend[3]            
            
            // render clinicianTabs -- base page is overview
            return res.render('patientOverview', {loggedIn: req.isAuthenticated(), required: reqMeasurements, patient: patient, bcg: bcg, weight: weight, insulin: insulin, exercise: exercise, measurements: measurements})

        } catch (err) {
            return next(err)
        }
    } else {
        res.render('login');
    }
}

const getDataById = async (req, res) => {
    if (req.isAuthenticated()) {
        const id = req.params.patient_id;
        // get the patient's recorded data today
        const measurements = await Measurement.find({patientId: id}).sort({"date": -1}).lean(); 
        //const dates = getDatesFromPatientObj(measurements);

        const patient = await Patient.findById(id).lean(); 
        const dates = await getDatesInRange(new Date(patient.join_date), new Date())
        const reqMeasurements = Object.keys(patient["measurements"])

        const measurementsByDate = groupMeasurementsByDate(measurements, dates);

        for (let i = 0; i < measurements.length; i++) {
            var convertedDate = measurements[i].date;
            measurements[i].date = convertedDate.toLocaleString(DateTime.DATETIME_MED);
        }

        res.render('patientOverview', {loggedIn: req.isAuthenticated(), required: reqMeasurements, measurement: measurements, groupedByDate: measurementsByDate});
    }
    else {
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
    getPatientById,
    insertData,
    getNewPatientForm,
    getPatientMessages,
    getDataById
}