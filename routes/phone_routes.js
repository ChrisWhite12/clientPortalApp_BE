const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse


router.post('/', (req, res) => {
    const client = require('twilio')(process.env.ACC_SID, process.env.AUTH_TOKEN)
    console.log('in phone post request - ', req.body)

    client.messages
    .create({
        body: req.body.text,
        from: process.env.TWILIO_PHONE,
        to: process.env.PHONE1
    })
    .then(message => {
        console.log(message.sid)
        console.log('message',message);
        res.sendStatus(200)
    })
    .catch(err => console.log('err',err))

})

module.exports = router