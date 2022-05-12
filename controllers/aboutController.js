const { User } = require('../models/user')

// function which handles requests for  displaying About Diabetes page
const getAboutDiabetes = (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user 
        res.render('aboutDiabetes.hbs', {loggedIn: req.isAuthenticated(), theme: user.theme})
    }
    else {
        res.render('aboutDiabetes.hbs', {loggedIn: req.isAuthenticated()})
    }
    
}

// function which handles requests for  displaying About this Website page
const getAboutWebsite = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user 
        res.render('aboutWebsite.hbs', {loggedIn: req.isAuthenticated(), theme: req.user.theme})
    }
    else {
        res.render('aboutWebsite.hbs', {loggedIn: req.isAuthenticated()})
    }
    
}

// exports an object, which contain functions imported by router
module.exports = {
    getAboutDiabetes,
    getAboutWebsite,
}
