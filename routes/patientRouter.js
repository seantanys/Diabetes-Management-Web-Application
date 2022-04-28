const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

patientRouter.get('/', patientController.redirectToDashboard)
patientRouter.get('/record', patientController.getMeasurementPage)
patientRouter.post('/record', patientController.submitMeasurement)
patientRouter.get('/dashboard', patientController.getPatientPage)
patientRouter.get('/account', patientController.getPatientAccountPage)

// export the router
module.exports = patientRouter
