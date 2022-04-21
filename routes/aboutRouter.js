const express = require('express')

// create our Router object
const aboutRouter = express.Router()

// require our controller
const aboutController = require('../controllers/aboutController')

aboutRouter.get('/', aboutController.returnHome)

// add a route to handle the GET request for all demo data
aboutRouter.get('/diabetes', aboutController.getAboutDiabetes)

// add a route to handle the GET request for one data instance
aboutRouter.get('/website', aboutController.getAboutWebsite)

// export the router
module.exports = aboutRouter
