const chai = require('chai')
const User = require('../models/user')

let should = chai.should()
process.env.NODE_ENV = 'test'

const { app } = require('../app')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const agent = chai.request.agent(app)

let tic1Id = ''
let tic2Id = ''


//create Ticket, correct parameters
describe('createTicket', function(){

    it("should login user", function(done){loginUser(done)})

    it('should create a ticket', function(done) {
        agent.post('/ticket')
        .send({
            appId: '1234',
            appDate: new Date(),
            status: 'pending',
            notified: false
        })
        .end((err, res) => {
            tic1Id = res.body.ticId
            res.should.have.property('status').equal(201)
            done()
        })
    })

    it('should create a ticket', function(done) {
        agent.post('/ticket')
        .send({
            appId: '2341',
            appDate: new Date(),
            status: 'pending',
            notified: false
        })
        .end((err, res) => {
            tic2Id = res.body.ticId
            res.should.have.property('status').equal(201)
            done()
        })
    })

    it('shouldn\'t create a ticket with incorrect details', function(done) {
        agent.post('/ticket')
        .send({
            foo: 'bar'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(500)
            done()
        })
    })

    it("should logout user", function(done){logoutUser(done)})

    it('shouldn\'t create a ticket with no user', function(done) {
        agent.post('/ticket')
        .send({
            appId: '1234',
            appDate: new Date(),
            status: 'pending',
            notified: false
        })
        .end((err, res) => {
            res.should.have.property('status').equal(401)
            done()
        })
    })
})

describe('readTicket test', function(){

    it("should login user", function(done){loginUser(done)})

    it('should read tickets', function(done) {
        agent.get('/ticket')
        .end((err, res) => {
            res.body.length.should.be.equal(2)
            res.should.have.property('status').equal(200)
            done()
        })
    })

    it("should logout user", function(done){logoutUser(done)})

    it('shouldn\'t read tickets logged out', function(done) {
        agent.get('/ticket')
        .end((err, res) => {
            res.should.have.property('status').equal(401)
            done()
        })
    })
})

describe('updateTicket test', function(){
    it("should login user", function(done){loginUser(done)})
    
    //change Ticket - correct details
    it('should update with correct details', function(done) {
        agent.put(`/ticket/${tic1Id}`)
        .send({
            status: 'accepted'
        })   
        .end((err, res) => {
            res.body.should.have.property('status').equal('accepted')
            res.body.should.have.property('appId').equal('1234')
            res.should.have.property('status').equal(200)
            done()
        })
    })

    //change Ticket - incorrect Id
    it('shouldn\'t update with wrong id', function(done) {
        agent.put(`/ticket/12984`)
        .send({
            status: 'accepted'
        })   
        .end((err, res) => {
            res.should.have.property('status').equal(500)
            done()
        })
    })

    it("should logout user", function(done){logoutUser(done)})

    it('shouldn\'t update when logged out', function(done) {
        agent.put(`/ticket/${tic1Id}`)
        .send({
            status: 'rejected'
        })   
        .end((err, res) => {
            res.should.have.property('status').equal(401)
            done()
        })
    })
})

describe('deleteTicket test', function(){
    
    it("should login user", function(done){loginUser(done)})
    
    //delete Ticket - correct Id
    it('should delete ticket with correct Id', function(done) {
        agent.delete(`/ticket/${tic1Id}`)
        .end((err, res) => {
            res.should.have.property('status').equal(200)
            done()
        })
    })
    
    //delete Ticket - incorrect Id
    it('shouldn\'t delete ticket with incorrect Id', function(done) {
        agent.delete(`/ticket/123012`)
        .end((err, res) => {
            res.should.have.property('status').equal(500)
            done()
        })
    })

    it('should read tickets', function(done) {
        agent.get('/ticket')
        .end((err, res) => {
            res.body.length.should.be.equal(1)
            res.should.have.property('status').equal(200)
            done()
        })
    })


    it("should logout user", function(done){logoutUser(done)})

    it('shouldn\'t delete ticket when logged out', function(done) {
        agent.delete(`/ticket/${tic2Id}`)
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

const logoutUser = (done) => {
    agent.get('/user/logout')
    .end((err, res) => {
        res.should.have.property('status').equal(200)
        done()
    })
}