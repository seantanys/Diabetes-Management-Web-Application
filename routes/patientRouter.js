const express = require('express')
const app = require('../app.js');
const { body, check, validationResult } = require('express-validator');

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')
const clinicianController = require('../controllers/clinicianController')

// route to handle the GET request for redirecting to patient dashboard
patientRouter.get('/', patientController.redirectToDashboard)

// route to handle the GET request for measurement page
patientRouter.get('/record', app.hasRole('patient'), patientController.getMeasurementPage)

// route to handle the GET request for submitting a measurement 
patientRouter.post('/record', app.hasRole('patient'),
                    body('value').not().isEmpty().isNumeric(),
                     patientController.submitMeasurement)

// route to handle the GET request for patient dashboard 
patientRouter.get('/dashboard', app.hasRole('patient'), patientController.getPatientPage)

// route to handle the GET request for patient account 
patientRouter.get('/account', app.hasRole('patient'), patientController.getPatientAccountPage)

patientRouter.get('/data', app.hasRole('patient'), patientController.getPatientDataPage)

patientRouter.post('/account/change-password', clinicianController.validate('changePassword'),
                    body('curr_pw').not().isEmpty().escape(),
                    body('new_pw').not().isEmpty().escape(),
                    body('confirm_new_pw').not().isEmpty().escape(),
                    check('new_pw')
                        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                        .withMessage('Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number'),
                    check('confirm_new_pw')
                        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                        .withMessage('Password must minimum eight characters, at least one uppercase letter, one lowercase letter and one number'),
                    app.hasRole('patient'), patientController.changePassword)

patientRouter.post('/account/change-theme', app.hasRole('patient'), patientController.changeTheme)

// export the router
module.exports = patientRouter
