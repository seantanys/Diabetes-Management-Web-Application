const mongoose = require('mongoose')

const measurementSchema = new mongoose.Schema({
    type: { type: String, required: [true, "input is required bruv"] },
    patientId: { type: String, required: true }, // when patient enters data, use _id = (new ObjectId).toString() to convert id to string
    value: { type: Number, required: [true, "value is required bruv"] },
    date: {type: Date, default: Date.now},
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
    dob: {type: Date, required: true},
    join_date: {type: Date, default: Date.now},
    measurements: {
        bcg: {
            // required: {type: Boolean, required:true, default:false},
            minimum: Number,
            maximum: Number
        },
        weight: {
            minimum: Number,
            maximum: Number
        },
        insulin: {
            minimum: Number,
            maximum: Number
        },
        exercise: {
            minimum: Number,
            maximum: Number
        },
        required: false
    }
});

const Patient = mongoose.model('Patient', patientSchema)
const Measurement = mongoose.model('Measurement', measurementSchema)
// const CurrentMeasurement = mongoose.model('CurrentMeasurement',currentMeasurementSchema)

module.exports = {Patient, Measurement}