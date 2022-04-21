const mongoose = require('mongoose')

const measurementSchema = new mongoose.Schema({
    type: { type: String, required: true },
    value: Number,
    date: Date,
    comment: String
})

const patientSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: String,
    age: Number,
    join_date: {type: Date, default: Date.now},
    measurement:[measurementSchema]
})
const Patient = mongoose.model('Patient', patientSchema)
const Measurement = mongoose.model('Measurement', measurementSchema)

module.exports = {Patient, Measurement}
