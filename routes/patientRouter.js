const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// route to handle the GET request for redirecting to patient dashboard
patientRouter.get('/', patientController.redirectToDashboard)

// route to handle the GET request for measurement page
patientRouter.get('/record', patientController.getMeasurementPage)

// route to handle the GET request for submitting a measurement 
patientRouter.post('/record', patientController.submitMeasurement)

// route to handle the GET request for patient dashboard 
patientRouter.get('/dashboard', patientController.getPatientPage)

// route to handle the GET request for patient account 
patientRouter.get('/account', patientController.getPatientAccountPage)

// export the router
module.exports = patientRouter
