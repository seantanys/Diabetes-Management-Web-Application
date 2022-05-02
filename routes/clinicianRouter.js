const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// route to handle the GET request for creating new patient
clinicianRouter.get('/create', clinicianController.getNewPatientForm)

// route to handle the GET request for all patients data
// changed /dashboard to just /
clinicianRouter.get('/', clinicianController.getAllPatientData)

// route to handle the GET request for one patient data
clinicianRouter.get('/:patient_id', clinicianController.getDataById)

// route to handle the POST request new patient, adding to the database
// changed /dashboard to just /
clinicianRouter.post('/', clinicianController.insertData)

// export the router
module.exports = clinicianRouter

