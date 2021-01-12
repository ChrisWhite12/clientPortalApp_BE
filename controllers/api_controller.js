
const fetch = require('node-fetch')
const { Base64 } = require('js-base64')
const { response } = require('express')

const readPatient = (req,res) => {
    let patient_out = {}
    if(req.user != undefined){
        console.log(req.user.email)
        getPatientByEmail(req)
        .then(response => response.json())
        .then(pat_data => {
            // console.log(pat_data.patients[0].appointments.links.self)
            const curr_date = new Date(Date.now()).toJSON()
            // console.log(curr_date)
            //---filter appointments by after current time (?q=appointment_start:>2020-01-01-T08:30:00Z)-----## UTC
            // ?q=appointment_start:>${curr_date}
            if(pat_data.patients.length >= 1){
                fetch(`${pat_data.patients[0].appointments.links.self}`, {
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
                .catch((err) => console.log(err))
            }
            else{
                console.log('no user found')
                patient_out = {
                    patient: 'null',
                    appointments: []
                }
                res.status(200);
                res.send(patient_out)
            }
        })
        .catch((err) => console.log(err))
    }
    else{
        console.log('no user defined')
        res.sendStatus(400)
    }
}

const checkUser = (req,res,next) => {
    console.log(req.body.email)
    getPatientByEmail(req)
    .then(response => response.json())
    .then(pat_data => {
        console.log(pat_data)
        if (pat_data.patients.length >= 1){
            console.log('checkUser - email exists')
            return next()
        }
        else{
            console.log('checkUser - no data/ not registered')
            res.status(400)
            res.json({
                error: 'Email not registered with Brain Train'
            })
        }
    })
    .catch((err) => console.log(err))
}

const updatePatient = (patientInfo) => {
    fetch(`https://api.au2.cliniko.com/v1/patients/${req.user.id}`, {
        method: 'PUT',
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${Base64.encode(process.env.API_KEY2)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        }
    })
    .then(res => res.json())
    .then(data => console.log(data))

}

const getPatientByEmail = (req) => {
    return fetch(`https://api.au2.cliniko.com/v1/patients?q=email:=${req.user.email}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${Base64.encode(process.env.API_KEY2)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        }
    })
}

module.exports = {
    readPatient,
    checkUser,
    updatePatient
}