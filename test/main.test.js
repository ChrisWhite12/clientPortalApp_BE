const chai = require('chai')
const User = require('../models/user')
const Ticket = require('../models/ticket');
const mongoose = require('mongoose');

let should = chai.should()
process.env.NODE_ENV = 'test'

const { app, server } = require('../app')
const chaiHttp = require('chai-http');
const { UserInstance } = require('twilio/lib/rest/chat/v1/service/user');
chai.use(chaiHttp)

const agent = chai.request.agent(app)

before((done) => {    
    mongoose.connection.once('open',() => {
        agent.post('/user/register')
        .send({
            email: 'be@testing.com',
            password: 'asdf123'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(201)
            done()
        })
    })    
});

after((done) => {
    agent.close()
    mongoose.connection.db.dropCollection('sessions', async () => {
        await User.deleteMany()
        await Ticket.deleteMany()
        mongoose.connection.close(function () {
            server.close(() => {
            })
        })
    })    
    done();
})

describe("truthy test - main.test.js", () => {
    it("example test", () => {
        (1).should.be.equal(1);
    })
})

describe("auth tests", () => {
    require('./auth.test.js')
})

describe("phone tests", () => {
    require('./phone.test.js')
})

describe("ticket tests", () => {
    require('./ticket.test.js')
})

describe("api tests", () => {
    require("./api.test.js")
})
