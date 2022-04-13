const getAboutDiabetes = (req,res) => {
    res.render('aboutDiabetes.hbs')
}

const getAboutWebsite = (req,res) => {
    res.render('aboutWebsite.hbs')
}

module.exports = {
    getAboutDiabetes,
    getAboutWebsite
}