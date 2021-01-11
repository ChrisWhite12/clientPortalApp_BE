const mongoose = require('mongoose');
const { findTicket, getAllTickets } = require('../utils/ticket_utils');
const Ticket = require('../models/ticket');
const request = require('supertest')

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()

const {
    connectToDb,
    disconnectFromDb
} = require('./config');

describe('main test', () => {
    
    describe("example test - running api_controller.test.js", () => {
        it("example test", () => {
            (1).should.equal(1);
        })
    })

    describe("readPatient", () => {
        it('should return one patient with an email', (done) => {

            done()
        })
        it('should return the correct length of appointments', (done) => {

            done()
        })
    })

    describe("checkUser", () => {
        it("should return next() if user in cliniko", (done) => {

            done()
        })
        it("should return error if not registered in cliniko", (done) => {

            done()
        })
    })

    describe("updateUser", () => {
        it("should update user address_1", (done) =>{

            done()
        })
    })

})