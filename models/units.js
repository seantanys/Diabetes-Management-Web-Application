const mongoose = require('mongoose')

// define the unitsSchema
const unitsSchema = new mongoose.Schema({
    bcg: {
        name: Number,
        unit: String
    },
    weight: {
        name: Number,
        unit: String
    },
    insulin: {
        name: Number,
        unit: String
    },
    exercise: {
        name: Number,
        unit: String
    },
});