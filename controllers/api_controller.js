
const fetch = require('node-fetch')
const { Base64 } = require('js-base64')
const { response } = require('express')

const readPatient = async (req,res) => {
    let patient_out = {}
    console.log(req.session)


    if(req.user != undefined){
        console.log(req.user.email)
        await getPatientByEmail(req.user.email)
        .then(response => response.json())
        // .then((x) => console.log('In then',x))
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
                // .then((x) => console.log('app',x))
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
                    console.log('PATIENT OUT',patient_out)
                    res.status(200);
                    res.send(patient_out)
                }
                )
                .catch((err) => console.log(err))
            }
            else{
                console.log('no user found ----')
                patient_out = {
                    patient: 'null',
                    appointments: []
                }
                res.status(200);
                res.send(patient_out)
            }
        })
        .catch((err) => console.log('ERROR',err))
    }
    else{
        console.log('no user defined')
        // console.log(res)
        res.sendStatus(400)
    }
}

const checkUser = async (req,res,next) => {
    console.log(req.body.email)
    await getPatientByEmail(req.body.email)
    .then(response => response.json())
    .then(pat_data => {
        console.log(pat_data)
        if (pat_data.patients.length >= 1){
            // console.log(pat_data.patients[0])
            console.log('checkUser - email exists in cliniko')
            req.patId = pat_data.patients[0].id 
            req.role = ''
            return next()
        }
        else{
            
            getUserByEmail(req.body.email)
            .then(response => response.json())
            .then(prac_data => {
                console.log(prac_data)
                console.log(prac_data.users[0].id)
                let user_found = false
                prac_data.users.forEach(element => {
                    console.log(element.email)
                    if(element.email == req.body.email){
                        console.log('user found')
                        user_found = true
                    }
                });
                if(user_found){
                    console.log('checkUser - registered as a practitioner')
                    req.patId = ''
                    req.role = 'admin'
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
    })
    .catch((err) => console.log(err))
}

const updatePatient = (req,res) => {
    console.log('---------------------updating patient--------------')
    console.log(req.body)
    console.log(req.user.patId)
    fetch(`https://api.au2.cliniko.com/v1/patients/${req.user.patId}`, {
        method: 'PUT',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Basic ${Base64.encode(process.env.API_KEY2)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        },
        body: JSON.stringify({address_1: '1 test st', address_2: "blah"})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.address_1)
        res.sendStatus(200)
    })
    .catch(err => console.log(err))

}

const getPatientByEmail = async (email) => {
    console.log('ByEmail - ',email)
    console.log('In get patientByemail')
    return await fetch(`https://api.au2.cliniko.com/v1/patients?q=email:=${email}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${Base64.encode(process.env.API_KEY2)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        }
    })
}

const getUserByEmail = async(email) => {
    // ?q=email:=${email}
    return await fetch(`https://api.au2.cliniko.com/v1/users`, {
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