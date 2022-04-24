const mongoose = require('mongoose')

const measurementSchema = new mongoose.Schema({
    patientId : { type: String },
    type: { type: String, required: true },
    value: Number,
    date: Date,
    comment: String
})

// const currentMeasurementSchema = new mongoose.Schema({
//     measurementId: {type: mongoose.Schema.Types.ObjectId, ref: 'Measurement'}
// })

const patientSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    dob : {type: Date, required: true},
    join_date: {type: Date, default: Date.now},
    measurements:{
        recordBCG: {
            record: {type: Boolean, required:true, default:false},
            minimum: Number,
            maximum: Number,
        },
        recordWeight: {
            record: {type: Boolean, required:true, default:false},
            minimum: Number,
            maximum: Number,
        },
        recordInsulin: {
            record: {type: Boolean, required:true, default:false},
            minimum: Number,
            maximum: Number,
        },
        recordExercise: {
            record: {type: Boolean, required:true, default:false},
            minimum: Number,
            maximum: Number,
        }
    }
    // recordWeight: {type: Boolean, required:true, default:false},
    // recordInsulin: {type: Boolean, required:true, default:false},
    // recordExercise: {type: Boolean, required:true, default:false},
    // measurements: [currentMeasurementSchema]
})
const Patient = mongoose.model('Patient', patientSchema)
const Measurement = mongoose.model('Measurement', measurementSchema)

module.exports = {Patient, Measurement,}
