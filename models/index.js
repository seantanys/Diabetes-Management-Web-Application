// Load envioronment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// setup Mongoose
const mongoose = require('mongoose')

// Connect to your mongo database using the MONGO_URL environment variable.
// Locally, MONGO_URL will be loaded by dotenv from .env.
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    dbName: 'diabetes-at-home-test'
    })
    .then(() => {
        console.log(`Connection success.`)
    })
    .catch(err => {
        console.log("Connection to Mongo failed.")
})

// Exit on error
const db = mongoose.connection.on('error', err => {
    console.error(err);
    process.exit(1)
})

// Log to console once the database is open
db.once('open', async () => {
    console.log(`Mongo connection started on ${db.host}:${db.port}`)
})

require('./patient')
require('./measurement')
require('./message')
require('./note')
require('./user')