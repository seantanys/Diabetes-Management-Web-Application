const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// add a route to handle the GET request for all people data
clinicianRouter.get('/', clinicianController.getAllPeopleData)

// add a route to handle the GET request for one data instance
clinicianRouter.get('/:id', clinicianController.getDataById)

// add a new JSON object to the database
clinicianRouter.post('/', clinicianController.insertData)

// export the router
module.exports = clinicianRouter
