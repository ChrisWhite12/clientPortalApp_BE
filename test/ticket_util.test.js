const mongoose = require('mongoose');
const { findTicket, getAllTickets } = require('../utils/ticket_utils');
const Ticket = require('../models/ticket');
const request = require('supertest')
var {app} = require('../app')

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()

const {
    connectToDb,
    disconnectFromDb
} = require('./config');

describe('main test', () => {

    let ticketId = null;
    // Use done to deal with asynchronous code - done is called when the hooks completes
    before((done) => {
        connectToDb(done);
    });

    beforeEach(() => {
        setupData();
    })

    afterEach((done) => {
        tearDownData().exec(() => done());
    })

    after((done) => {
        disconnectFromDb(done);
    })
    
    describe("example test - running ticket_util.test.js", () => {
        it("example test", () => {
            (1).should.equal(1);
        })
    })

    describe("getAllTickets", () => {
        it('should have a length of 3', (done) => {
            getAllTickets().exec((err,tic) => {
                tic.should.have.length(3)
            })
            done();
        })
    })

    describe("find tickets", () => {
        it('should find tickets matching to patient', (done) => {
            // role = "null"
            // _id = 1
            const response = request(app).get('/ticket')

            findTicket(req).exec((err,tic) => {
                tic.should.have.length(2)
            })
            done()
        })
        it('should find tickets matching to practitioner', (done) => {
            // role = 'admin'
            // email = "chris_white_12@hotmail.com"
            findTicket(req).exec((err,tic) => {
                tic.should.have.length(2)
            })
            done()
        })
    })

    describe("update tickets", () => {
        it('should update ticket to accept', (done) => {
            updateTicket(req).exec((err,tic) => {
                console.log(tic)
            })
            done()
        })
    })

})

// Setup and tear down functions
async function setupData() {
    date1 = new Date(2021, 1, 1, 8, 0, 0);


    let testTickets = [
        {
            appId: 'abc111',
            userId: 1,
            appDate: date1,
            status: 'requested',
            notified: false,
            practitionerId: 'chris_white_12@hotmail.com'
        },
        {
            appId: 'abc112',
            userId: 2,
            appDate: date1,
            status: 'requested',
            notified: false,
            practitionerId: 'chris_white_12@hotmail.com'
        },
        {
            appId: 'abc113',
            userId: 1,
            appDate: date1,
            status: 'requested',
            notified: false,
            practitionerId: 'other@practitioner.com'
        }
    ];

    for (const tic of testTickets) {
        await Ticket.create(tic)
    }
}

function tearDownData() {
    return Ticket.deleteMany();
}