const getAboutDiabetes = (req, res) => {
    res.render('aboutDiabetes.hbs')
}

const getAboutWebsite = (req, res) => {
    res.render('aboutWebsite.hbs')
}

const returnHome = (req, res) => {
    // res.render('index')
}

module.exports = {
    getAboutDiabetes,
    getAboutWebsite,
    returnHome,
}
