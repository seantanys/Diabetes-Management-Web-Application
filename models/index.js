// SEAN'S ATTEMPT BELOW
const mongoose = require('mongoose')
let connectionURL = 'mongodb+srv://seantan:seantan@cluster0.gv1sn.mongodb.net/test'
mongoose.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true,
                    dbName: 'diabetes-at-home'})
    .then(() => {
        console.log(`Connection success.`)
    })
    .catch(err => {
        console.log("Connection to Mongo failed.")
    })

const db = mongoose.connection.on('error', err => {
    console.error(err);
    process.exit(1)
})
// Log to console once the database is open
db.once('open', async () => {
    console.log(`Mongo connection started on ${db.host}:${db.port}`)
})
require('./patient')