const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    patientId: {type: String, required: true},
    clinicianId: {type: String, required: true},
    date: {type: Date, required: true},
    message: {type: String, required: true}
})

const Message = mongoose.model('Message', messageSchema)

module.exports = {Message}