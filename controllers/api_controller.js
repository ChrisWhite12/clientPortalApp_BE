
const fetch = require('node-fetch')
const { Base64 } = require('js-base64')
const { response } = require('express')

const apiTemplate = (query_val,req,res) => {
    // console.log("query:" + query_val)
    fetch(`https://api.au2.cliniko.com/v1/${query_val}`, {
        headers: {
        Accept: "application/json",
        Authorization: `Basic ${Base64.encode(process.env.API_KEY2)}`,
        // Authorization: `Basic TVMwMU1URTNNRFE1TXpBek1ESTFOalE1TXpBdGNUWnVlSFp0YWxKMk56Um9NVmRLYmtkS1VrOWtUSFZ0ZDNZMmQzVXpiRmMtYXUyOg==`,
        "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        // "User-Agent": "Caity McC (ferguselchancho@gmail.com)"
        }
    })
    .then(response => response.json())
    .then(data => {
        res.status(200);
        res.send(data)
    })
    .catch((err) => console.log(err))
}

const readPatients = (req,res) => {
    console.log(req.user.email)
    const patient_search = req.user.email ? `?q=email:=${req.user.email}` : '';
    apiTemplate(`patients${patient_search}`,req,res)
}
const readAppointments = (req,res) => {
    apiTemplate('appointment_types',req,res)
}

module.exports = {
    readAppointments,
    readPatients
}