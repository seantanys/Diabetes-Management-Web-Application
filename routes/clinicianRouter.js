const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

clinicianRouter.get('/create', clinicianController.getNewPatientForm)

// add a route to handle the GET request for all patients data
clinicianRouter.get('/dashboard', clinicianController.getAllPatientData)

// add a route to handle the GET request for one data instance
clinicianRouter.get('/:patient_id', clinicianController.getDataById)

clinicianRouter.post('/dashboard', clinicianController.insertData)

// export the router
module.exports = clinicianRouter

