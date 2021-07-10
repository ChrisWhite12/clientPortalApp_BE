const chai = require('chai')
const User = require('../models/user')

let should = chai.should()
process.env.NODE_ENV = 'test'

const { app } = require('../app')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const agent = chai.request.agent(app)

describe("example test - running api_controller.test.js", () => {
    it("example test", () => {
        (1).should.equal(1);
    })
})

describe('readPatient test', function(){

    //login to be@testing
    it('should login user', function(done){
        loginUserPat(done)
    })
    
    //readPatient - user exists
    it('should read the patient for valid email', function(done) {
        agent.get('/api/patient')
        .end((err, res) => {
            res.should.have.property('status').equal(200)
            res.body.patient.should.have.property('first_name').equal('be')
            res.body.patient.should.have.property('last_name').equal('testing')
            done()
        })
    })
    
    //logout
    it('should logout', function(done){
        logoutUser(done)
    })

    it('should login user', function(done){
        loginUserPrac(done)
    })

    //readPatient - practitioner
    it('shouldn\'t read patient for practitioner', function(done) {
        agent.get('/api/patient')
        .end((err, res) => {
            res.should.have.property('status').equal(404)
            done()
        })
    })

    it('should logout', function(done){
        logoutUser(done)
    })
})

describe('getPracApp test', function(){
    //login cw12@hm
    it('should login user', function(done){
        loginUserPrac(done)
    })

    //get practitioners appointment
    it('should get the practictioners appointments', function(done) {
        agent.get('/api/practitioner/appointments')
        .end((err, res) => {
            res.should.have.property('status').equal(200)
            done()
        })
    })

    //logout
    it('should logout', function(done){
        logoutUser(done)
    })

    //get practitioners appointment - no user
    it('shouldn\'t get the practictioners appointments if logged out', function(done) {
        agent.get('/api/practitioner/appointments')
        .end((err, res) => {
            res.should.have.property('status').equal(401)
            done()
        })
    })
})

describe('updatePatient test', function(){
    
    //login be@testing
    it('should login user', function(done){
        this.timeout(5000)
        loginUserPat(done)
    })

    //updatePatient
    it('should update patient details', function(done) {
        this.timeout(5000)
        agent.put('/api/patient')
        .send({"first_name": 'testtest'})
        .end((err, res) => {
            res.should.have.property('status').equal(200)
            done()
        })
    })

    //readPatient
    it('should read the patient for valid email', function(done) {
        agent.get('/api/patient')
        .end((err, res) => {
            res.should.have.property('status').equal(200)
            res.body.patient.should.have.property('first_name').equal('testtest')
            res.body.patient.should.have.property('last_name').equal('testing')
            done()
        })
    })

    //updatePatient
    it('should update patient details', function(done) {
        this.timeout(5000)
        agent.put('/api/patient')
        .send({"first_name": 'be'})
        .end((err, res) => {
            res.should.have.property('status').equal(200)
            done()
        })
    })

    //logout
    it('should logout', function(done){
        logoutUser(done)
    })

    //updatePatient - no user
    it('shouldn\'t update patient details if logged out', function(done) {
        agent.put('/api/patient')
        .send({first_name: 'be'})
        .end((err, res) => {
            res.should.have.property('status').equal(401)
            done()
        })
    })
})


const loginUserPat = (done) => {
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

const loginUserPrac = (done) => {
    agent.post('/user/login')
    .send({
        email: 'chris_white_12@hotmail.com',
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