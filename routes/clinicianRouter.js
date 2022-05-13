const express = require('express')
const app = require('../app.js');

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// route to handle the GET request for creating new patient
clinicianRouter.get('/create', clinicianController.getNewPatientForm)

clinicianRouter.get('/messages', clinicianController.getPatientMessages)

// route to handle the GET request for all patients data
clinicianRouter.get('/dashboard', clinicianController.getAllPatientData)

// route to handle the GET request for one patient data
clinicianRouter.get('/:patient_id', clinicianController.getDataById)

clinicianRouter.get('/messages', clinicianController.getPatientMessages)

// route to handle the POST request new patient, adding to the database
clinicianRouter.post('/dashboard', clinicianController.insertData)

// export the router
module.exports = clinicianRouter

