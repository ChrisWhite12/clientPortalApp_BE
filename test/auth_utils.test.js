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
})

// const isLoggedIn 