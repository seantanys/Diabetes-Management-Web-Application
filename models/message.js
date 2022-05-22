const mongoose = require('mongoose')

// define the messageSchema
const messageSchema = new mongoose.Schema({
    patientId: {type: String, required: true},
    clinicianId: {type: String, required: true},
    date: {type: Date, required: true},
    message: {type: String, required: true}
})

// compile the messageSchema into Model
const Message = mongoose.model('Message', messageSchema)

module.exports = {Message}