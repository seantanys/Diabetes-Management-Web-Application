const patientData = require('../models/patientModel')
const {Patient} = require('../models/patient')
const {Measurement} = require('../models/patient')

// // handle request to get all people data instances
// const getAllPeopleData = (req, res) => {
//     res.render('clinicianMessages', { data: peopleData })
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


const getMeasurementPage = async (req, res) => {
    const id = "62640dd547975600730c38d7"; // HARD CODED PATIENT ID
    const data = await Patient.findById(id).lean();
    const todayData = await Measurement.find({patientId: id, date: { $lte: new Date()}}).lean();

    console.log(todayData)

    // find data in measurements, by id, then filter it to show only the current date's measurements.
    // store it to a data structure
    
    if (data) {
        res.render('record.hbs', { singlePatient: data, todayData: todayData })
    } else {
        console.log("patient data not found")
        res.render('notfound')
    }
}

const submitMeasurement = async (req, res) => {

    try {
        const newMeasurement = new Measurement ({
            type: req.body.type,
            patientId: "62640dd547975600730c38d7",
            value: parseFloat(req.body.value),
            date: Date.now(),
            comment: req.body.comment
        })
        await newMeasurement.save();
        console.log("Measurement successfully saved to db")
        res.redirect('/patient/record');
    } catch (err) {
        console.log("error submitting measurement.")
    }

    
    // add loading bar
    
}

// exports an object, which contain functions imported by router
module.exports = {
    // getAllPeopleData,
    // getDataById,
    // insertData,
    getMeasurementPage,
    submitMeasurement
}
