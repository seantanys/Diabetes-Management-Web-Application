const mongoose = require('mongoose')

const measurementSchema = new mongoose.Schema({
    type: { type: String, required: true },
    value: Number,
    date: Date,
    comment: String
})

const currentMeasurementSchema = new mongoose.Schema({
    measurementId: {type: mongoose.Schema.Types.ObjectId, ref: 'Measurement'}
})

const patientSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: String,
    age: Number,
    join_date: {type: Date, default: Date.now},
    recordBCG: {type: Boolean, required:true, default:false},
    recordWeight: {type: Boolean, required:true, default:false},
    recordInsulin: {type: Boolean, required:true, default:false},
    recordExercise: {type: Boolean, required:true, default:false},
    measurements: [currentMeasurementSchema]
})
const Patient = mongoose.model('Patient', patientSchema)
const Measurement = mongoose.model('Measurement', measurementSchema)
const CurrentMeasurement = mongoose.model('CurrentMeasurement',currentMeasurementSchema)

module.exports = {Patient, Measurement,CurrentMeasurement}
