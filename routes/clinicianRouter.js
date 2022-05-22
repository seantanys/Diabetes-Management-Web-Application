const express = require('express')
const app = require('../app.js');
// const {Clinician} = require('../models/clinician')
// const {User} = require('../models/user')
const { body, check, validationResult } = require('express-validator');

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// route to handle the GET request for creating new patient
clinicianRouter.get('/create', app.hasRole('clinician'), clinicianController.getNewPatientForm)

clinicianRouter.post('/create', app.hasRole('clinician'), clinicianController.validate('insertData'), clinicianController.insertData)

clinicianRouter.get('/messages', app.hasRole('clinician'), clinicianController.getSupportMessagesPage)

clinicianRouter.post('/messages',
                    body('supportMsg').not().isEmpty().escape(),
                    body('recipientId').not().isEmpty().escape(),
                    app.hasRole('clinician'), clinicianController.changeSupportMessage)

// route to handle the GET request for all patients data
clinicianRouter.get('/dashboard', app.hasRole('clinician'), clinicianController.getAllPatientData)

// route to handle the GET request for one patient data
// clinicianRouter.get('/manage-patient/:patient_id', app.hasRole('clinician'), clinicianController.getDataById)

clinicianRouter.get('/comments', app.hasRole('clinician'), clinicianController.getPatientComments)

clinicianRouter.get('/account', app.hasRole('clinician'), clinicianController.getAccountPage);

clinicianRouter.post('/account/change-password',
                    body('curr_pw').not().isEmpty().escape(),
                    body('new_pw').not().isEmpty().escape(),
                    body('confirm_new_pw').not().isEmpty().escape(),
                    check('new_pw')
                        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                        .withMessage('Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number'),
                    check('confirm_new_pw')
                        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                        .withMessage('Password must minimum eight characters, at least one uppercase letter, one lowercase letter and one number'),
                    app.hasRole('clinician'), clinicianController.changePassword);

// route after clicking on patients name
clinicianRouter.get('/manage-patient/:patient_id', app.hasRole('clinician'), clinicianController.getPatientOverview)
// route to make note for patient
clinicianRouter.post('/manage-patient/:patient_id', app.hasRole('clinician'), clinicianController.writeNote)

// route to get data table for respective measurements for patient
clinicianRouter.get('/manage-patient/:patient_id/bcg', app.hasRole('clinician'), clinicianController.getPatientBCG) 
clinicianRouter.get('/manage-patient/:patient_id/weight', app.hasRole('clinician'), clinicianController.getPatientWeight) 
clinicianRouter.get('/manage-patient/:patient_id/insulin', app.hasRole('clinician'), clinicianController.getPatientInsulin) 
clinicianRouter.get('/manage-patient/:patient_id/exercise', app.hasRole('clinician'), clinicianController.getPatientExercise) 

clinicianRouter.get('/manage-patient/:patient_id/manage', app.hasRole('clinician'), clinicianController.getDataBounds);
clinicianRouter.post('/manage-patient/:patient_id/manage', app.hasRole('clinician'),  clinicianController.validate('manageDataBounds'), 
    clinicianController.manageDataBounds) 

clinicianRouter.get('/manage-patient/:patient_id/message', app.hasRole('clinician'), clinicianController.getIndividualMessage);
clinicianRouter.post('/manage-patient/:patient_id/message', 
                    body('supportMsg').not().isEmpty().escape(),
                    body('recipientId').not().isEmpty().escape(),
                    app.hasRole('clinician'), clinicianController.changeIndividualMessage);

clinicianRouter.post('/manage-patient/:patient_id/delete-note', app.hasRole('clinician'), clinicianController.deleteNote);
clinicianRouter.post('/manage-patient/:patient_id/add-note', 
                    body('comment').not().isEmpty().escape(),
                    app.hasRole('clinician'), clinicianController.writeNote);


// export the router
module.exports = clinicianRouter