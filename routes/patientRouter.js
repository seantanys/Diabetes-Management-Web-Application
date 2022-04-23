const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// // add a route to handle the GET request for all people data
// patientRouter.get('/', patientController.getAllPeopleData)

// // add a route to handle the GET request for one data instance
// patientRouter.get('/:id', patientController.getDataById)

patientRouter.get('/record', patientController.getMeasurementPage)

patientRouter.get('/dashboard', patientController.getPatientPage)

// add a new JSON object to the database
// patientRouter.post('/', patientController.insertData)

// export the router
module.exports = patientRouter
