// function which handles requests for displaying the login page
const getLoginPage = (req, res) => {
    res.render('login', { layout: "patient-logged-out.hbs" })
}

// exports an object, which contain function imported by router
module.exports = {
    getLoginPage
}