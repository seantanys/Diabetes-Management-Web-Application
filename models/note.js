const mongoose = require('mongoose')

// define the noteSchema
const noteSchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    comment: { type: String, required: true },
    color: {type: String, default: "dark-yellow"}
});

// compile the noteSchemas into Model
const Note = mongoose.model('Note', noteSchema)

module.exports = {Note}