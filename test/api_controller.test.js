const mongoose = require('mongoose');
const {readPatient, checkUser, updatePatient } = require('../controllers/api_controller')
const Ticket = require('../models/ticket');
const request = require('supertest')

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()

const {
    connectToDb,
    disconnectFromDb
} = require('./config');
const { expect } = require('chai');

describe('api_utils', () => {
    describe("example test - running api_controller.test.js", () => {
        it("example test", () => {
            (1).should.equal(1);
        })
    })

    describe("readPatient", () => {
        it('should return one patient with an email', async() => {
            let req = {
                user: {
                    email: "be@testing.com"
                }
            }
            let res = {}
            await readPatient(req,res)
            // .then(res)
            .then((x) => console.log('x',x))
            // console.log('tv',tempVar)
            expect(res.patient).to.be.an('object')
        })
        it('should return the correct length of appointments', () => {

        })
    })

    describe("checkUser", () => {
        it("should return next() if user in cliniko", () => {

        })
        it("should return error if not registered in cliniko", () => {

        })
    })

    describe("updateUser", () => {
        it("should update user address_1", () =>{

        })
    })

})