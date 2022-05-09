const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// define the patientSchema
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    dob: {type: Date, required: true},
    join_date: {type: Date, default: Date.now},
    role: {type: String, required: true},
    role_id: {type: String, required: true},
    theme: {type: String, default:'default', required: true}
});

// derive age from patientSchema using date of birth
userSchema.virtual('age').get(function () {
    currentDate = new Date()
    return `${currentDate.getYear() - this.dob.getYear()}`
})

userSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

const SALT_FACTOR = 10

// hash password before saving
userSchema.pre('save', function save(next) {
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
const User = mongoose.model('User', userSchema)

module.exports = {User}