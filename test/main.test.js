const chai = require('chai')
const User = require('../models/user')
const mongoose = require('mongoose');

let should = chai.should()
process.env.NODE_ENV = 'test'

const { app, server } = require('../app')
const chaiHttp = require('chai-http')
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

after(done => {
    agent.close()
    done()
})

after((done) => {
    mongoose.connection.db.dropCollection('users', () => {
        mongoose.connection.close(function () {
        server.close(() => {
          done();
        })
    })
})
})

describe("truthy test - main.test.js", () => {
    it("example test", () => {
        (1).should.be.equal(1);
    })
})

describe("phone tests", () => {
    require('./phone.test.js')
})

describe("auth tests", () => {
    require('./auth.test.js')
})

describe("ticket tests", () => {
    require('./ticket.test.js')
})

describe("api tests", () => {
    require("./api.test.js")
})