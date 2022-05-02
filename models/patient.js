const mongoose = require('mongoose')

// define the patientSchema
const patientSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    dob: {type: Date, required: true},
    join_date: {type: Date, default: Date.now},
    measurements: {
        bcg: {
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
    },
    clinician_notes: {
        date: {type: Date, default: Date.now},
        comment: String
    }
});

// derive full name from patientSchema using first and last name
patientSchema.virtual('fullName').get(function () {
    return `${this.first_name} ${this.last_name}`
})

// derive age from patientSchema using date of birth
patientSchema.virtual('age').get(function () {
    currentDate = new Date()
    return `${currentDate.getYear() - this.dob.getYear()}`
})

// compile the measurementSchemas into Model
const Patient = mongoose.model('Patient', patientSchema)

module.exports = {Patient}
