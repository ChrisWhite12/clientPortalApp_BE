
const fetch = require('node-fetch')
const { Base64 } = require('js-base64')
const { response } = require('express')

const apiTemplate = (query_val,req,res) => {
    fetch(`https://api.au2.cliniko.com/v1/${query_val}`, {
        headers: {
        Accept: "application/json",
        Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
        "User-Agent": "Chris White (chris_white_12@hotmail.com)"
        }
    })
    .then(response => response.json())
    .then(data => {
        res.status(200);
        res.send(data)
    })
}


const readPatients = (req,res) => {
    apiTemplate('patients',req,res)
    
}
const readAppointments = (req,res) => {
    apiTemplate('appointment_types',req,res)
}

module.exports = {
    readAppointments,
    readPatients
}