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
        it('should return on entry from email', () => {

        })
        it('should return null from invalid email', () => {

        })
    })

    describe("isAdmin", () => {
        it("should return next() if admin", () => {

        })
        it("should return 403 status if not admin", () => {

        })
    })

    describe("isLoggedIn", () => {
        it("should return next() if logged in", () => {

        })
        it("should return 403 status if not logged in", () => {

        })
    })

})

// const isLoggedIn 