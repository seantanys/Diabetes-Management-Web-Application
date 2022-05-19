const express = require('express')
const app = require('../app.js');
// const {Clinician} = require('../models/clinician')
// const {User} = require('../models/user')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// route to handle the GET request for creating new patient
clinicianRouter.get('/create', clinicianController.getNewPatientForm)

clinicianRouter.post('/create', clinicianController.insertData)

//clinicianRouter.get('/messages', clinicianController.getPatientMessages)

//clinicianRouter.get('/supportMessage', clinicianController.changeSupportMessage)

// route to handle the GET request for all patients data
clinicianRouter.get('/dashboard', clinicianController.getAllPatientData)

// route to handle the GET request for one patient data
clinicianRouter.get('/:patient_id', app.hasRole('clinician'), clinicianController.getPatientOverview) //Anh
clinicianRouter.post('/:patient_id', app.hasRole('clinician'), clinicianController.writeNote) //Anh

clinicianRouter.get('/:patient_id/bcg', app.hasRole('clinician'), clinicianController.getPatientBCG) //Anh
clinicianRouter.get('/:patient_id/weight', app.hasRole('clinician'), clinicianController.getPatientWeight) //Anh
clinicianRouter.get('/:patient_id/insulin', app.hasRole('clinician'), clinicianController.getPatientInsulin) //Anh
clinicianRouter.get('/:patient_id/exercise', app.hasRole('clinician'), clinicianController.getPatientExercise) //Anh

// Manage patient tab
clinicianRouter.get('/:patient_id/manage', app.hasRole('clinician'), clinicianController.getDataBoudnds) // Sanskar
clinicianRouter.post('/:patient_id/manage', app.hasRole('clinician'), clinicianController.manageDataBounds) // Sanskar

// Support messages tab - not sure what Sean is doing for this but this is Anh's format
//clinicianRouter.get('/:patient_id/message', app.hasRole('clinician'), clinicianController.getSupportMessages) // TO IMPLEMENTTTTTT
//clinicianRouter.post('/:patient_id/message', app.hasRole('clinician'), clinicianController.writeSupportMessage) // TO IMPLEMENTTTTTT




// route to handle the POST request new patient, adding to the database
// clinicianRouter.post('/dashboard', clinicianController.insertData)

// export the router


// clinicianRouter.post('/addClinician', async (req, res) => { // using POST for Postman demo
//     const newClinician = new Clinician({
//     first_name: "anh@dah.com",
//     last_name: "pha",
//     screen_name: "Clinician Anh",
//     dob: new Date("2001-02-27"),
//     })


//     // extract the object id from the patient document
//     const clinician = await newClinician.save();  
//     const clinicianId = clinician._id;

//     // then we create the user document and save to db
//     const newUser = new User({
//         username: "anh@dah.com",
//         password: "anh",
//         dob: new Date("2001-02-27"),
//         role: "clinician",
//         role_id: clinicianId,
//         theme: "default"
//     });

//     await newUser.save();

//     })

module.exports = clinicianRouter