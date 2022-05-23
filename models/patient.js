const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// define the patientSchema
const patientSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    screen_name: {type: String, required: true},
    dob: {type: Date, required: true},
    bio: {type: String, required: true},
    engagement_rate: {type: Number, default: 0, required: true},
    clinicianId: {type: String, required: true},
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
