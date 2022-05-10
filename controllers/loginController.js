// function which handles requests for displaying the login page
const getLoginPage = (req, res) => {
    res.render('login', { layout: "patient-logged-out.hbs" })
}

const submitLogin = (req, res) => { 
    res.redirect('/patient/')   // login was successful, send user to home page
} 

// exports an object, which contain function imported by router
module.exports = {
    getLoginPage,
    submitLogin
}