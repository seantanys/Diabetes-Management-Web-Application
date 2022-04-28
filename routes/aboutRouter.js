const express = require('express')

// create our Router object
const aboutRouter = express.Router()

// require our controller
const aboutController = require('../controllers/aboutController')

aboutRouter.get('/diabetes', aboutController.getAboutDiabetes)

aboutRouter.get('/website', aboutController.getAboutWebsite)

// export the router
module.exports = aboutRouter
