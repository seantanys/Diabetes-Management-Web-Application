const express = require('express')
const app = require('../app.js');
// const {Clinician} = require('../models/clinician')
// const {User} = require('../models/user')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// route to handle the GET request for creating new patient
clinicianRouter.get('/create', app.hasRole('clinician'), clinicianController.getNewPatientForm)

clinicianRouter.post('/create', app.hasRole('clinician'), clinicianController.validate('insertData'), clinicianController.insertData)

clinicianRouter.get('/messages', app.hasRole('clinician'), clinicianController.getSupportMessagesPage)

clinicianRouter.post('/messages', clinicianController.changeSupportMessage)

// route to handle the GET request for all patients data
clinicianRouter.get('/dashboard', app.hasRole('clinician'), clinicianController.getAllPatientData)

// route to handle the GET request for one patient data
// clinicianRouter.get('/manage-patient/:patient_id', app.hasRole('clinician'), clinicianController.getDataById)

clinicianRouter.get('/comments', app.hasRole('clinician'), clinicianController.getPatientComments)

clinicianRouter.get('/account', app.hasRole('clinician'), clinicianController.getAccountPage);

clinicianRouter.post('/account/change-password', app.hasRole('clinician'), clinicianController.changePassword);

clinicianRouter.get('/manage-patient/:patient_id', app.hasRole('clinician'), clinicianController.getPatientOverview)
// route to make note for patient
clinicianRouter.post('/manage-patient/:patient_id', app.hasRole('clinician'), clinicianController.writeNote) // TO IMPLEMENTTTTTT

clinicianRouter.get('/manage-patient/:patient_id/bcg', app.hasRole('clinician'), clinicianController.getPatientBCG) 
clinicianRouter.get('/manage-patient/:patient_id/weight', app.hasRole('clinician'), clinicianController.getPatientWeight) 
clinicianRouter.get('/manage-patient/:patient_id/insulin', app.hasRole('clinician'), clinicianController.getPatientInsulin) 
clinicianRouter.get('/manage-patient/:patient_id/exercise', app.hasRole('clinician'), clinicianController.getPatientExercise) 

clinicianRouter.get('/manage-patient/:patient_id/manage', app.hasRole('clinician'), clinicianController.getDataBounds);

// Manage patient tab
//clinicianRouter.get('/:patient_id/manage', app.hasRole('clinician'), clinicianController.getDataBoudnds) // TO IMPLEMENTTTTTT
//clinicianRouter.post('/:patient_id/manage', app.hasRole('clinician'), clinicianController.manageDataBounds) // TO IMPLEMENTTTTTT

// Support messages tab
//clinicianRouter.get('/:patient_id/message', app.hasRole('clinician'), clinicianController.getSupportMessages) // TO IMPLEMENTTTTTT
//clinicianRouter.post('/:patient_id/message', app.hasRole('clinician'), clinicianController.writeSupportMessage) // TO IMPLEMENTTTTTT


// route to handle the POST request new patient, adding to the database
// clinicianRouter.post('/dashboard', clinicianController.insertData)

// export the router
const sendMessage = require('../socket').sendMessage

clinicianRouter.post('/api/messages', (req, res) => {
    const { message } = req.body
    messages.push(message)
    sendMessage(message)
    return res.send(messages)
})

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