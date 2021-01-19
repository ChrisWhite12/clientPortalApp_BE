
process.env.NODE_ENV = 'test'

const mongoose = require('mongoose');
const { findTicket, getAllTickets, updateTicket } = require('../utils/ticket_utils');
const Ticket = require('../models/ticket');
const User = require('../models/user')
const request = require('supertest')
var {app} = require('../app')

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()

const {
    connectToDb,
    disconnectFromDb
} = require('./config');
const user = require('../models/user');


describe('main test', () => {

    let ticketId = null;
    // Use done to deal with asynchronous code - done is called when the hooks completes
    before((done) => {
        connectToDb(done);

        Ticket.deleteMany()
        .then(() => console.log('tickets deleted'))
        .catch(() => console.log('error deleting tickets'))
        User.deleteMany()
        .then(() => console.log('Users deleted'))
        .catch(() => console.log('error deleting Users'))

        setupData();
    });
    
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
const setupData = async () => {
    date1 = new Date(2021, 1, 1, 8, 0, 0);

    // create patient user
    let user1 = await User.create({
        email: 'test@test.com',
        password: 'testtest',
        resetToken: '',
        role: ''
    })

    // create practitioner user
    let user2 = await User.create({
        email: 'chris_white_12@hotmail.com',
        password: 'testtest',
        resetToken: '',
        role: 'admin'
    })

    let user3 = await User.create({
        email: 'user3@test.com',
        password: 'testtest',
        resetToken: '',
        role: ''
    })
    
    let testTickets = [
        
        {
            appId: 'abc113',
            userId: user1._id,
            appDate: date1,
            status: 'requested',
            notified: false,
            practitionerId: 'other@practitioner.com'
        },
        {
            appId: 'abc111',
            userId: user1._id,
            appDate: date1,
            status: 'requested',
            notified: false,
            practitionerId: user2._id
        },
        {
            appId: 'abc112',
            userId: user3._id,
            appDate: date1,
            status: 'requested',
            notified: false,
            practitionerId: user2._id
        }
    ];


    for (let tic of testTickets) {
        temp_tic = await Ticket.create(tic)
    }
}
