const mongoose = require('mongoose')

const measurementSchema = new mongoose.Schema({
    type: { type: String, required: [true, "input is required"] },
    patientId: { type: String, required: true },
    value: { type: Number, required: [true, "value is required"] },
    date: {type: Date, default: Date.now},
    comment: {type: String, default: ""}
});

const Measurement = mongoose.model('Measurement', measurementSchema)

module.exports = {Measurement}