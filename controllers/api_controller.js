
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

        if(!userByEmail.ok){
            res.status(404)
            res.json({error: 'Error - fetching user by email'})
        }

        const prac_data = await userByEmail.json()

        console.log('prac data', prac_data)

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
        console.log(data.address_1)
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

module.exports = {
    readPatient,
    checkUser,
    updatePatient
}