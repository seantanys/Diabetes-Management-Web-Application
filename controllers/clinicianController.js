const {Patient} = require('../models/patient')
const {Measurement} = require('../models/patient')
const {CurrentMeasurement} = require('../models/patient')

const m = new Measurement({
    type: "BCG",
    value: 404,
    comment: "today i recorded 404 error ",
  });

const getAllPeopleData = async (req, res, next) => {
    try {
        const patients = await Patient.find().lean()
        return res.render('allData', { data: patients })
    } catch (err) {
        return next(err)
    }
}

// const getAllMeasurements = async (req, res) => {
//     const patientDashboard = []
//     const patientIds = []
//     const allMeasurements = []
//     const currentTime = new Date()
//     currentTime.setHours(0, 0, 0);

//     try {
//         const patients = await Patient.find().lean()
//         for (let i = 0; i < patients.length; i++) {
//             patientIds.push([patients[i]._id.toString(), patients[i].first_name.toString()]);
//         }

//         for (let i = 0; i < patientIds.length; i++) {
//             bcgMeasurement = await Measurement.find({patientId: patientIds[i][0], type:'bcg', date: { $gte: currentTime}}).lean()
            
//             if (bcgMeasurement.length > 0) {
//                 allMeasurements.push(bcgMeasurement)
//                 for (let j = 0; j < bcgMeasurement.length; j++) {
//                     // console.log(bcgMeasurement[j]['type'])
//                     patientDashboard.push({first_name: patientIds[i][1], type: bcgMeasurement[j]['type'], value: bcgMeasurement[j]['value'], date: bcgMeasurement[j]['date'], comment:  bcgMeasurement[j]['comment']})
//                 }
//             }     
//         }

//         res.send(patientDashboard)
//     } catch (e) {
//         console.log(e)
//     }
// }

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

const getBloodGlucoseMeasurement = async(req,res,next) => {

    //find pat
    let thisUser = await Patient.findOne( {first_name: 'John'})

    //find BCG reading
    let BCGMeasurement = await Measurement.findById("62629354c5f744df352601f6")
    // BCGReading = new CurrentMeasurement({measurementId: BCGMeasurement._id})
    // thisUser.measurements = thisUser.measurements || [];
    thisUser.measurements.push(BCGMeasurement)

    await thisUser.save()
    result = await Patient.findOne( {nameGiven: 'John'})
    res.send(result)
}

const insertData = async (req, res, next) => {
    try {
        const newPatient = new Patient({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            join_date: req.body.join_date,
            recordBCG: req.body.recordBCG,
            recordWeight: req.body.recordWeight,
            recordInsulin: req.body.recordInsulin,
            recordExercise: req.body.recordExercise,
            measurement:{
                type: "BCG",
                value: 404,
                comment: "today i recorded 404 error ",
              },
        })
        await newPatient.save();
        return res.redirect('/clinician')
    }catch (err) {
        return next(err)
    }
}

module.exports = {
    getAllPeopleData,
    getDataById,
    insertData,
    getBloodGlucoseMeasurement,
    // getAllMeasurements
}