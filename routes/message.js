const express = require('express')
const router = express.Router()

const messages = []

router.get('/messages', (req, res) => {
    return res.render('message', { messages })
    })

router.post('/messages', (req, res) => {
    const { message } = req.body
    messages.push(message)
    return res.redirect('back')
})

router.post('/api/messages', (req, res) => {
    const { message } = req.body
    messages.push(message)
    return res.send(messages)
    })
    
module.exports = router