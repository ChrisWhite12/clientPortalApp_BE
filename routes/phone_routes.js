const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse


router.post('/', (req, res) => {
    const client = require('twilio')(process.env.ACC_SID, process.env.AUTH_TOKEN)
    console.log('in phone post request - ', req.body)
    // client('AC0f3d76c8a30cf077431cba07e51d1400', 'c3b0570ec95f0a6a6780456f85f4c704')
    // client(process.env.ACC_SID, process.env.AUTH_TOKEN)
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