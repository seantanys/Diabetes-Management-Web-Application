const {Patient} = require('../models/patient')
const {Measurement} = require('../models/patient')
const {CurrentMeasurement} = require('../models/patient')

const id = "6265e740332717bb9fe3eb4c";

// const getAllPeopleData = async (req, res, next) => {
//     try {
//         const patients = await Patient.find({},{}).lean()
        
//         let patientDashboard = []
//         patients.forEach(async patient => {
//             const currentTime = new Date()
//             currentTime.setHours(0, 0, 0);
//             bcgMeasurement = await Measurement.findOne({patientId: patient._id.toString(), type:'bcg', date: { $gte: currentTime}}).lean();
            
//             // const currentTime = new Date()
//             // currentTime.setHours(0, 0, 0);
//             // console.log(patient._id.toString())
//             //const bcgMeasurement = await Promise.all(Measurement.findOne({patientId: patient._id.toString(), type:'bcg', date: { $gte: currentTime}}).lean());

            
//             console.log(bcgMeasurement)

//         });
//         //console.log(patientDashboard)
//         return res.send(patientDashboard)
//         // return res.render('allData', { data: patients })
//     } catch (err) {
//         return next(err)
//     }
// }

const getAllPeopleData = async (req, res, next) => {
    const patientDashboard = []
    const patientIds = []
    const allMeasurements = []
    const currentTime = new Date()
    currentTime.setHours(0, 0, 0);

    try {
        const patients = await Patient.find().lean()
        for (let i = 0; i < patients.length; i++) {
            patientIds.push([patients[i]._id.toString(), patients[i].first_name.toString()+" "+patients[i].last_name.toString()]);
        }

        for (let i = 0; i < patientIds.length; i++) {
            bcgmeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'bcg'}).sort({"date": -1}).lean()
            weightmeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'weight'}).sort({"date": -1}).lean()
            insulinmeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'insulin'}).sort({"date": -1}).lean()
            exercisemeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'exercise'}).sort({"date": -1}).lean()
            // exercisemeasurement = await Measurement.findOne({patientId: patientIds[i][0], type:'exercise', date: { $gte: currentTime}}).lean()
            
            // if (measurement.length > 0) {
            //     allMeasurements.push(measurement)
                // for (let j = 0; j < measurement.length; j++) {
                    // console.log(bcgMeasurement[j]['type'])
                    patientDashboard.push({patient: patients[i],bcg: (bcgmeasurement)?bcgmeasurement['value']:"",
                    weight: (weightmeasurement)?weightmeasurement['value']:"",insulin: (insulinmeasurement)?insulinmeasurement['value']:"",
                    exercise: (exercisemeasurement)?exercisemeasurement['value']:""})
                //}
            //}     
        }
        // console.log(patientDashboard)
        //return res.send(patientDashboard)
        return res.render('allData', { layout: "clinician.hbs", data: patientDashboard })
    } catch (err) {
        return next(err)
    }
}



// const getAllPeopleData = async (req, res, next) => {
//     try {
//         const patients = await Patient.find({},{}).lean()
//         bcgmeasurement = await Measurement.findOne({patientId: patient._id.toString(), type:'bcg', date: { $gte: currentTime}}).lean();
//         let patientDashboard = []
//         // patients.forEach(async patient => {
//         //     const currentTime = new Date()
//         //     currentTime.setHours(0, 0, 0);
//         //     bcgMeasurement = await Measurement.findOne({patientId: patient._id.toString(), type:'bcg', date: { $gte: currentTime}}).lean();
//         //     const patientData = {patient:patient.first_name,bcg:bcgMeasurement};
//         //     patientDashboard.push(patientData);
//         //     // const currentTime = new Date()
//         //     // currentTime.setHours(0, 0, 0);
//         //     // console.log(patient._id.toString())
//         //     //const bcgMeasurement = await Promise.all(Measurement.findOne({patientId: patient._id.toString(), type:'bcg', date: { $gte: currentTime}}).lean());
//         //     // const weightMeasurement = await Measurement.findOne({patientId: patient._id.toString(), type:'weight', date: { $gte: currentTime}},{value:true}).lean();
//         //     // const exerciseMeasurement = await Measurement.findOne({patientId: patient._id.toString(), type:'exercise', date: { $gte: currentTime}},{value:true}).lean();
//         //     // const insulinMeasurement = await Measurement.findOne({patientId: patient._id.toString(), type:'insulin', date: { $gte: currentTime}},{value:true}).lean();
//         //     // console.log([patient._id.toString(),bcgMeasurement,weightMeasurement,exerciseMeasurement,insulinMeasurement])
            
//         //     console.log(patientData)
//         //     patientDashboard.push(patientData);
//         // });
//         //console.log(patientDashboard)
//         return res.send(patientDashboard)
//         // return res.render('allData', { data: patients })
//     } catch (err) {
//         return next(err)
//     }
// }




const getDataById = async(req, res, next) => {
    try {

        const currentTime = new Date()
        currentTime.setHours(0, 0, 0);

        const patient = await Patient.findById(id).lean()
        const measurement = await Measurement.find({patientId: id, type:'bcg',date: { $gte: currentTime}}).lean();

        const bcgMeasurement = getBCGMeasurement(measurement);
        // const weightMeasurement = getWeightMeasurement(measurement);
        // const insulinMeasurement = getInsulinMeasurement(measurement);
        // const exerciseMeasurement = getExerciseMeasurement(measurement);

        // console.log(req.params.patient_id)
        console.log(bcgMeasurement)
        if (!patient) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found person
        return res.render('oneData', { oneItem: patient, bcg: bcgMeasurement,})
        // return res.send(weightMeasurement)
    } catch (err) {
        return next(err)
    }
}

function getBCGMeasurement(arr) {
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].type == 'bcg'){
            return arr[i]
        }
    }
    return "";
}

function getWeightMeasurement(arr) {
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].type == 'weight'){
            return arr[i]
        }
    }
    return "";
}

function getInsulinMeasurement(arr) {
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].type == 'insulin'){
            return arr[i]
        }
    }
    return "";
}

function getExerciseMeasurement(arr) {
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].type == 'exercise'){
            return arr[i]
        }
    }
    return "";
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

const getNewPatientForm = async (req, res, next) => {
    try {
        return res.render('newPatient')
    } catch (err) {
        return next(err)
    }
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
            // measurement:{
            //     type: "BCG",
            //     value: 404,
            //     comment: "today i recorded 404 error ",
            //   },
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
    getNewPatientForm
}