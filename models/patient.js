const mongoose = require('mongoose')

const measurementSchema = new mongoose.Schema({
    type: { type: String, required: [true, "input is required bruv"] },
    patientId: { type: String, required: true }, // when patient enters data, use _id = (new ObjectId).toString() to convert id to string
    value: { type: Number, required: [true, "value is required bruv"] },
    date: Date,
    comment: {type: String, default: ""}
});

// const currentMeasurementSchema = new mongoose.Schema({
//     measurementId: {type: mongoose.Schema.Types.ObjectId, ref: 'Measurement'}
// })

// const patientSchema = new mongoose.Schema({
//     first_name: { type: String, required: true },
//     last_name: String,
//     age: Number,
//     join_date: {type: Date, default: Date.now},
//     recordBCG: {type: Boolean, required:true, default:false},
//     recordWeight: {type: Boolean, required:true, default:false},
//     recordInsulin: {type: Boolean, required:true, default:false},
//     recordExercise: {type: Boolean, required:true, default:false},
//     measurements: [currentMeasurementSchema]
// })

const patientSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    dob: {type: Date, default: Date.now},
    req_measurements: {
        bcg: {type: Boolean, required:true, default:false},
        weight: {type: Boolean, required:true, default:false},
        insulin: {type: Boolean, required:true, default:false},
        exercise: {type: Boolean, required:true, default:false},
    },
    thresholds: {
        bcg: {type: Number, required:true, default:0},
        weight: {type: Number, required:true, default:0},
        insulin: {type: Number, required:true, default:0},
        exercise: {type: Number, required:true, default:0},
    }
});

const Patient = mongoose.model('Patient', patientSchema)
const Measurement = mongoose.model('Measurement', measurementSchema)
// const CurrentMeasurement = mongoose.model('CurrentMeasurement',currentMeasurementSchema)

module.exports = {Patient, Measurement}