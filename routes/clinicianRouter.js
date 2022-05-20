const express = require('express')
const app = require('../app.js');

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// route to handle the GET request for creating new patient
clinicianRouter.get('/create', app.hasRole('clinician'), clinicianController.getNewPatientForm)

clinicianRouter.post('/create', app.hasRole('clinician'), clinicianController.insertData)

// route to handle the GET request for all patients data
clinicianRouter.get('/dashboard', app.hasRole('clinician'), clinicianController.getAllPatientData)

// route to handle the GET request for one patient data
clinicianRouter.get('/:patient_id', app.hasRole('clinician'), clinicianController.getPatientOverview)
// route to make note for patient
clinicianRouter.post('/:patient_id', app.hasRole('clinician'), clinicianController.writeNote) // TO IMPLEMENTTTTTT

clinicianRouter.get('/:patient_id/bcg', app.hasRole('clinician'), clinicianController.getPatientBCG) 
clinicianRouter.get('/:patient_id/weight', app.hasRole('clinician'), clinicianController.getPatientWeight) 
clinicianRouter.get('/:patient_id/insulin', app.hasRole('clinician'), clinicianController.getPatientInsulin) 
clinicianRouter.get('/:patient_id/exercise', app.hasRole('clinician'), clinicianController.getPatientExercise) 
clinicianRouter.get('/:patient_id/manage', app.hasRole('clinician'), clinicianController.getDataBounds) 

// Manage patient tab
//clinicianRouter.post('/:patient_id/manage', app.hasRole('clinician'), clinicianController.manageDataBounds) // TO IMPLEMENTTTTTT

// Support messages tab
//clinicianRouter.get('/:patient_id/message', app.hasRole('clinician'), clinicianController.getSupportMessages) // TO IMPLEMENTTTTTT
//clinicianRouter.post('/:patient_id/message', app.hasRole('clinician'), clinicianController.writeSupportMessage) // TO IMPLEMENTTTTTT


// route to handle the POST request new patient, adding to the database
// clinicianRouter.post('/dashboard', clinicianController.insertData)

// export the router
module.exports = clinicianRouter

