const express = require('express')

// create our Router object
const loginRouter = express.Router()

// require our controller
const loginController = require('../controllers/loginController')

// route to handle the GET request for the login page
loginRouter.get('/', loginController.getLoginPage)

// loginRouter.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), loginController.submitLogin)

// export the router
module.exports = loginRouter