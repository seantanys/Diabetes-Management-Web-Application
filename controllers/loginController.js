const getLoginPage = (req, res) => {
    res.render('login', { layout: "patient-logged-out.hbs" })
}

module.exports = {
    getLoginPage
}