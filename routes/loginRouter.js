const express = require('express')

// create our Router object
const loginRouter = express.Router()

// require our controller
const loginController = require('../controllers/loginController')

loginRouter.get('/', loginController.getLoginPage)

// export the router
module.exports = loginRouter