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
    
    describe("example test - running auth_util.test.js", () => {
        it("example test", () => {
            (1).should.equal(1);
        })
    })

    describe("getUserByEmail", () => {
        it('should return on entry from email', (done) => {

            done()
        })
        it('should return null from invalid email', (done) => {

            done()
        })
    })

    describe("isAdmin", () => {
        it("should return next() if admin", (done) => {

            done()
        })
        it("should return 403 status if not admin", (done) => {

            done()
        })
    })

    describe("isLoggedIn", () => {
        it("should return next() if logged in", (done) => {

            done()
        })
        it("should return 403 status if not logged in", (done) => {

            done()
        })
    })

})

// const isLoggedIn 