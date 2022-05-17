const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// define the patientSchema
const patientSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    screen_name: {type: String, required: false},
    dob: {type: Date, required: false},
    bio: {type: String, required: false},
    engagement_rate: {type: Number, required: false},
    clinicanId: {type: String, required: false},
    supportMessage : {type: String, default:""},
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
    }
});

// // derive full name from patientSchema using first and last name
// patientSchema.virtual('fullName').get(function () {
//     return `${this.first_name} ${this.last_name}`
// })

// // derive age from patientSchema using date of birth
// patientSchema.virtual('age').get(function () {
//     currentDate = new Date()
//     return `${currentDate.getYear() - this.dob.getYear()}`
// })

patientSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

const SALT_FACTOR = 10

// hash password before saving
patientSchema.pre('save', function save(next) {
    const user = this// go to next if password field has not been modified
    if (!user.isModified('password')) {
        return next()
    }

    // auto-generate salt/hash
    bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        //replace password with hash
        user.password = hash
        next()
    })
})

// compile the measurementSchemas into Model
const Patient = mongoose.model('Patient', patientSchema)

module.exports = {Patient}
