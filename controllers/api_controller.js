
const fetch = require('node-fetch')
const { Base64 } = require('js-base64')
const { response } = require('express')

const readPatient = (req,res) => {
    let patient_out = {}
    console.log(req.user.email)
    fetch(`https://api.au2.cliniko.com/v1/patients?q=email:=${req.user.email}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${Base64.encode(process.env.API_KEY2)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        }
    })
    .then(response => response.json())
    .then(pat_data => {
        // console.log(pat_data.patients[0].appointments.links.self)
        const curr_date = new Date(Date.now()).toJSON()
        // console.log(curr_date)
        //---filter appointments by after current time (?q=appointment_start:>2020-01-01-T08:30:00Z)-----## UTC
        fetch(`${pat_data.patients[0].appointments.links.self}?q=appointment_start:>${curr_date}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Basic ${Base64.encode(process.env.API_KEY2)}`,
                "User-Agent": "Chris White (chris_white_12@hotmail.com)",
            }
        })
        .then(app_res => app_res.json())
        .then(app_data => {
            // fetch(app_data.appointments[0].links.self, {
            //     headers: {
            //         Accept: "application/json",
            //         Authorization: `Basic ${Base64.encode(process.env.API_KEY2)}`,
            //         "User-Agent": "Chris White (chris_white_12@hotmail.com)",
            //     }
            // })

            patient_out = {
                patient: pat_data.patients[0],
                appointments: app_data.appointments
            }
            res.status(200);
            console.log(patient_out)
            res.send(patient_out)
        }
        )
        
    })
    .catch((err) => console.log(err))
}

module.exports = {
    readPatient
}