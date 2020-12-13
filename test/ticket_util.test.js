var { server, app } = require('../app.js')
const mongoose = require('mongoose');
const expect = require('expect');
const { findTicket, getAllTickets } = require('../utils/ticket_utils');
const Ticket = require('../models/ticket');
const request = require('supertest')

const {
    connectToDb,
    disconnectFromDb
} = require('./config');



describe("example test - running ticket_util", () => {
    test("example test", () => {
        expect("string").toBeTruthy();
    })
})


let ticketId = null;


// Use done to deal with asynchronous code - done is called when the hooks completes
beforeAll((done) => {
    // Connect to the database (same as we do in app.js)
    disconnectFromDb(done)
    connectToDb(done);
});

// Set up test data before each test
beforeEach(async function () {
    // Load a test record in setupData
    // Use await so we can access the postId, which is used by some tests
    let ticket = await setupData();
    ticketId = ticket._id;
});

// Delete test data after each test
afterEach((done) => {
    // Execute the deleteMany query
    tearDownData().exec(() => done());
});

afterAll((done) => {
    disconnectFromDb(done);
})

describe("getAllTickets should get 1", () => {
    test("return length of 1", () => {
        getAllTickets().exec((err,tic) => {
            expect(Object.keys(tic).length).toBe(1);
            done();
        })
    })
})

// describe("find by userId", () => {
//     test("appId should be abc123", () => {
//         const req = {
//             params: {
//                 userId: 1
//             }
//         }

//         utilities.findTicket(req).exec((err,tic) => {
//             expect(tic.appId).toBe('abc123')
//         })
//     })
// })

// Setup and tear down functions
function setupData() {
    let testTicket = {};
    date1 = new Date(2021, 1, 1, 8, 0, 0);
    testTicket.appId = 'abc123';
    testTicket.userId = 1
    testTicket.appDate = date1
    testTicket.status = 'requested'
    testTicket.notified = false
    return Ticket.create(testTicket);
}

function tearDownData() {
    return Ticket.deleteMany();
}