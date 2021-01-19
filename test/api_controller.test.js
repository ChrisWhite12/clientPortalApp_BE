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

describe('main test', () => {
    describe("example test - running api_controller.test.js", () => {
        it("example test", () => {
            (1).should.equal(1);
        })
    })

    describe("readPatient", () => {
        it('should return one patient with an email', () => {
            let req = {
                user: {
                    email: "be@testing.com"
                }
            }
            let res = {}
            readPatient(req)
            expect(res.patient).to.exist
        })
        it('should return the correct length of appointments', () => {

        })
    })

})