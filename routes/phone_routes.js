const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse


router.post('/', (req, res) => {
    if(req.user){
        const client = require('twilio')(process.env.ACC_SID, process.env.AUTH_TOKEN)
        client.messages
        .create({
            body: req.body.text,
            from: process.env.TWILIO_PHONE,
            to: process.env.PHONE1
        })
        .then(message => {
            res.status(200)
            res.json({message})
        })
        .catch(err => {
            res.status(400)
            res.json({message: err})
        })
    }
    else{
        res.status(401)
        res.json('User needs to be logged in to send messages')
    }

})

module.exports = router