const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// define the clinicianSchema
const clinicianSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    screen_name: {type: String, required: false},
    dob: {type: Date, required: false},
    patients : [String]
});

clinicianSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

const SALT_FACTOR = 10

// hash password before saving
clinicianSchema.pre('save', function save(next) {
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

const Clinician = mongoose.model('Clinician', clinicianSchema)

module.exports = {Clinician}