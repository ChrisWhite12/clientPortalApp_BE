const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse

const client = require('twilio')
// client(process.env.ACC_SID, process.env.AUTH_TOKEN);

router.post('/', (req, res) =>

    client.messages
    .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: process.env.TWILIO_PHONE,
        to: process.env.PHONE1
    })
    .then(message => {
        console.log(message.sid)
        console.log('message',message);
        res.sendStatus(200)
    })
    .catch(err => console.log('err',err))

)

router.post('/sms', (req,res) => {

    console.log('req ===== ',req.body.Body);
    res.sendStatus(200)
})

module.exports = router