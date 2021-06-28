
const fetch = require('node-fetch')
const { Base64 } = require('js-base64')
const { response } = require('express')

// const fetchHeader = {
//     headers: {
//         Accept: "application/json",
//         Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
//         "User-Agent": "Chris White (chris_white_12@hotmail.com)",
//     }
// }

const readPatient = async (req,res) => {
    let patient_out = {}
    console.log('req.body',req.body);
    console.log('req.user',req.user);
    if(req.user != undefined){
        console.log(req.user.email)
        const patientRes = await getPatientByEmail(req.user.email)

        if(!patientRes.ok){
            res.status(404)
            res.json({error: 'Error - fetching patient by email'})
        }

        const pat_data = await patientRes.json()

        const curr_date = new Date().toISOString()

        if(pat_data.patients.length >= 1){
            const appRes = await fetch(`${pat_data.patients[0].appointments.links.self}?q=appointment_start:>${curr_date}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
                    "User-Agent": "Chris White (chris_white_12@hotmail.com)",
                }
            })

            if(!appRes.ok){
                res.status(404)
                res.json({error: 'Error - fetching patient appointments'})
            }
    
            const app_data = await appRes.json()

            // console.log('app_data.appoinments',app_data.appointments);

            const appTypePromiseArr = app_data.appointments.map(item => {
                // console.log('item',item);
                return fetch(`${item.appointment_type.links.self}`,{
                    headers: {
                        Accept: "application/json",
                        Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
                        "User-Agent": "Chris White (chris_white_12@hotmail.com)",
                    }
                })
            })

            Promise.all( appTypePromiseArr )
            .then(res => Promise.all(res.map(r => r.json())))
            .then(resData =>{
                console.log('resData',resData);
                const updateApp = resData.map((el,ind) => {
                    return {...app_data.appointments[ind], appTypeName: el.name}
                })
                return updateApp
            })
            .then( updateApp => {
                patient_out = {
                    patient: pat_data.patients[0],
                    appointments: updateApp
                }
                res.status(200);
                res.send(patient_out)
            })

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
    }
    else{
        console.log('no user defined')
        res.sendStatus(400)
    }
}

const checkUser = async (req,res,next) => {
    const patByEmail = await getPatientByEmail(req.body.email)

    if(!patByEmail.ok){
        res.status(404)
        res.json({error: 'Error - fetching patient by email'})
    }

    const pat_data = await patByEmail.json()

    // console.log(pat_data)
    if (pat_data.patients.length >= 1){
        // console.log(pat_data.patients[0])
        console.log('checkUser - email exists in cliniko')
        req.patId = pat_data.patients[0].id 
        req.role = 'user'
        return next()
    }
    else{
        
        const userByEmail =  await getUsers()
        const getPrac = await getPractitioners()

        if(!userByEmail.ok || !getPrac.ok){
            res.status(404)
            res.json({error: 'Error - fetching user by email'})
        }

        const user_data = await userByEmail.json()
        const prac_data = await getPrac.json()


        let user_found = false

        user_data.users.forEach(userItem => {
            if(userItem.email == req.body.email){
                console.log('user found')
                user_found = true

                prac_data.practitioners.forEach(pracItem => {
                    //if prac_data.practitioners[ind].user === `https://api.au2.cliniko.com/v1/users/${userId}`
                    if(pracItem.user.links.self === `https://api.au2.cliniko.com/v1/users/${userItem.id}`){
                        console.log('found prac - ', pracItem.id);
                        req.pracId = pracItem.id
                    }
                    //set the pracId

                });
                
            }
        });
        if(user_found){
            console.log('checkUser - registered as a practitioner')
            req.patId = 'none'
            req.role = 'admin'
            return next()
        }
        else{
            console.log('checkUser - no data/ not registered')
            res.status(400)
            res.json({
                message: 'Email not registered with Brain Train'
            })
        }
    }
}

const updatePatient = (req,res) => {
    fetch(`https://api.au2.cliniko.com/v1/patients/${req.user.patId}`, {
        method: 'PUT',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(data => {
        res.sendStatus(200)
    })
    .catch(err => console.log(err))

}

const getPatientByEmail = (email) => {
    return fetch(`https://api.au2.cliniko.com/v1/patients?q=email:=${email}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        }
    })
}

const getUsers = () => {
    return fetch(`https://api.au2.cliniko.com/v1/users`, {
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        }
    })
}

const getPractitioners = async (req, res) => {
    console.log('in getPrac func')

    const curr_date = new Date().toISOString()
    const pracRes = await fetch(`https://api.au2.cliniko.com/v1/practitioners/${req.params.id}/appointments?q=appointment_start:>${curr_date}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Basic ${Base64.encode(process.env.API_KEY)}`,
            "User-Agent": "Chris White (chris_white_12@hotmail.com)",
        }
    })

    if(!pracRes.ok){
        res.status(404)
        res.json({error: 'Error - fetching practitioner appointments'})
    }

    const prac_data = await pracRes.json()

    console.log('prac_data',prac_data);

    res.status(200)
    res.send(prac_data)
}

module.exports = {
    readPatient,
    getPractitioners,
    checkUser,
    updatePatient
}