const chai = require('chai')
const User = require('../models/user')

let should = chai.should()
process.env.NODE_ENV = 'test'

const { app } = require('../app')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const agent = chai.request.agent(app)

describe("example test - running api_controller.test.js", () => {
    it("example test", () => {
        (1).should.equal(1);
    })
})


// const mongoose = require('mongoose');
// const {readPatient, checkUser, updatePatient } = require('../controllers/api_controller')
// const Ticket = require('../models/ticket');
// const request = require('supertest')

// process.env.NODE_ENV = 'test'

// const { app } = require('../app')

// const chai = require('chai')
// let chaiHttp = require('chai-http')
// // const agent = chai.request.agent(app)

// const { expect } = require('chai');

// describe('api controller test', () => {

//     // describe("readPatient", () => {
//     //     it('should return one patient with an email', async () => {
//     //         let req = {
//     //             user: {
//     //                 email: "test@test.com"
//     //             }
//     //         }
//     //         let res = {}
//     //         const res1 = await readPatient(req)
//     //         console.log('res',res);
//     //         console.log('res1',res1);
//     //         expect(res.patient).to.exist
//     //     })
//     // })

// })

//readPatient - user exists

//readPatient - no user

//get practitioners - correct pracId

//get practitioners - incorrect pracId

//updatePatient - correct patId

//updatePatient - incorrect patId