const { User } = require('../models/user')

// function which handles requests for  displaying About Diabetes page
const getAboutDiabetes = (req, res) => {
    res.render('aboutDiabetes.hbs', {loggedIn: req.isAuthenticated()})
}

// function which handles requests for  displaying About this Website page
const getAboutWebsite = async (req, res) => {
    res.render('aboutWebsite.hbs', {loggedIn: req.isAuthenticated()})
}

// exports an object, which contain functions imported by router
module.exports = {
    getAboutDiabetes,
    getAboutWebsite,
}
