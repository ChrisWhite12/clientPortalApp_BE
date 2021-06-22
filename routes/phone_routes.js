const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse

const client = require('twilio')('AC0f3d76c8a30cf077431cba07e51d1400', 'fdd62804e04703a559e222cd11821b02');

router.post('/', (req, res) =>

    client.messages
    .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+19293251592',
        to: '+61497586797'
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