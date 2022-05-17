const express = require('express')
const app = require('../app.js');

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// route to handle the GET request for creating new patient
clinicianRouter.get('/create', app.hasRole('clinician'), clinicianController.getNewPatientForm)

clinicianRouter.post('/create', app.hasRole('clinician'), clinicianController.insertData)

clinicianRouter.get('/messages', app.hasRole('clinician'), clinicianController.getPatientMessages)

// route to handle the GET request for all patients data
clinicianRouter.get('/dashboard', app.hasRole('clinician'), clinicianController.getAllPatientData)

// route to handle the GET request for one patient data
clinicianRouter.get('/:patient_id', app.hasRole('clinician'), clinicianController.getPatientById) 
clinicianRouter.get('/:patient_id/bcg', app.hasRole('clinician'), clinicianController.getPatientById) 
clinicianRouter.get('/:patient_id/weight', app.hasRole('clinician'), clinicianController.getPatientById) 
clinicianRouter.get('/:patient_id/insulin', app.hasRole('clinician'), clinicianController.getPatientById) 
clinicianRouter.get('/:patient_id/exercise', app.hasRole('clinician'), clinicianController.getPatientById) 

clinicianRouter.get('/messages', app.hasRole('clinician'), clinicianController.getPatientMessages)

// route to handle the POST request new patient, adding to the database
// clinicianRouter.post('/dashboard', clinicianController.insertData)

// export the router
module.exports = clinicianRouter

