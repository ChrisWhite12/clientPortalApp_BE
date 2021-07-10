const chai = require('chai')
const User = require('../models/user')

let should = chai.should()
process.env.NODE_ENV = 'test'

const { app } = require('../app')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const agent = chai.request.agent(app)


describe("example test - running phone.test.js", () => {
    it("example test", () => {
        (1).should.be.equal(1);
    })
})

describe('phone should send text', function () {
    this.timeout(10000)

    it('should login user', (done) => {
        loginUser(done)
    })

    // it('should send ok back', (done) => {
    //     agent.post('/phone')
    //     .send({
    //         text: 'testing message'
    //     })
    //     .end((err, res) => {
    //         res.should.have.property('status').equal(200)
    //         done()
    //     })
    // })
})

describe("phone shouldn't send text with no user", () => {

    it('should login user', (done) => {
        logoutUser(done)
    })

    it('should send Unauthorized back', (done) => {
        agent.post('/phone')
        .send({
            text: 'testing message'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(401)
            done()
        })
    })
})

const loginUser = (done) => {
    agent.post('/user/login')
    .send({
        email: 'be@testing.com',
        password: 'asdf123'
    })
    .end((err, res) => {
        res.should.have.property('status').equal(200)
        done()
    })
}

const registerUser = (done) => {
    agent.post('/user/register')
    .send({
        email: 'be@testing.com',
        password: 'asdf123'
    })
    .end((err, res) => {
        res.should.have.property('status').equal(200)
        done()
    })
}

const logoutUser = (done) => {
    agent.get('/user/logout')
    .end((err, res) => {
        res.should.have.property('status').equal(200)
        done()
    })
}