// const peopleData = require('../models/peopleModel')

// // handle request to get all people data instances
// const getAllPeopleData = (req, res) => {
//     res.render('allData', { data: peopleData })
// }

// // handle request to get one data instance
// const getDataById = (req, res) => {
//     // search the database by ID
//     const data = peopleData.find((data) => data.id === req.params.id)

//     // return data if this ID exists
//     if (data) {
//         res.render('oneData', { oneItem: data })
//     } else {
//         // You can decide what to do if the data is not found.
//         // Currently, an empty list will be returned.
//         res.sendStatus(404)
//     }
// }

// const insertData = (req, res) => {
//     const { id, first_name, last_name } = req.body
//     peopleData.push({ id, first_name, last_name })
//     return res.redirect('back')
// }

// // exports an object, which contain functions imported by router
// module.exports = {
//     getAllPeopleData,
//     getDataById,
//     insertData,
// }
const {Patient} = require('../models/patient')

const getAllPeopleData = async (req, res, next) => {
    try {
        const patients = await Patient.find().lean()
        return res.render('allData', { data: patients })
    } catch (err) {
        return next(err)
    }
}
const getDataById = async(req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patient_id).lean()
        if (!patient) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found person
        return res.render('oneData', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}

const insertData = (req, res) => {
    const newPatient = new Patient({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        join_date: req.body.join_date
        })
    newPatient.save( (err, result) => { // callback-style error-handler
        if (err) res.send(err)
        return res.send(result)
    })
}


module.exports = {
    getAllPeopleData,
    getDataById,
    insertData
}