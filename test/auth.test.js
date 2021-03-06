const chai = require('chai')
const User = require('../models/user')
const mongoose = require('mongoose');

let should = chai.should()
process.env.NODE_ENV = 'test'

const { app, server } = require('../app')

var sinon = require("sinon");
const chaiHttp = require('chai-http');
var sinonChai = require("sinon-chai");

const { checkUser } = require('../controllers/api_controller');
const { isLoggedIn } = require('../utils/auth_utils');
chai.use(chaiHttp)
const agent = chai.request.agent(app)
chai.use(sinonChai)

//should be able to register with correct details
describe("register", function (){

    it('should register with valid user', function(done){
        this.timeout(5000)
        agent.post('/user/register')
        .send({
            email: 'be2@testing.com',
            password: 'asdf123'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(201)
            done()
        })
    })

    it('it should register practitioner', function(done) {
        this.timeout(5000)
        agent.post('/user/register')
        .send({
            email: 'chris_white_12@hotmail.com',
            password: 'asdf123'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(201)
            done()
        })
    })
    
    it("shouldn't register with invalid user", function (done){
        agent.post('/user/register')
        .send({
            email: 'asdf@asdf.com',
            password: 'asdf123'
        })
        .end((err, res) => {
            // console.log('res.body ',res.body )
            res.should.have.property('status').equal(400)
            done()
        })
    })
})


describe("Login", () => {

    //login with correct details
    it('should login with correct details', function(done) {
        agent.post('/user/login')
        .send({
            email: 'be2@testing.com',
            password: 'asdf123'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(200)
            done()
        })
    })
    
    //logout
    it("should logout", function(done) {
        agent.get('/user/logout')
        .end((err, res) => {
            res.should.have.property('status').equal(200)
            done()
        })
    })

    //login with incorrect details
    it("shouldn't login with incorrect details", function(done) {
        agent.post('/user/login')
        .send({
            email: 'be2@testing.com',
            password: 'asdfasdf'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(401)
            done()
        })
    })
    
})

describe("forgot password", () => {
    //forgot password should return ok if correct email (get token)
    it("should return ok for correct email", function (done){
        this.timeout(10000)
        agent.post('/user/forgot_password')
        .send({
            email: 'be2@testing.com'
        })
        .end((err, res) => {
            // console.log('res.body',res.body);
            res.should.have.property('status').equal(200)
            done()
        })
    })
    
    //forgot password - incorrect email
    it("should error if incorrrect email", function (done){
        this.timeout(10000)
        agent.post('/user/forgot_password')
        .send({
            email: 'asdf@asdf.com'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(401)
            done()
        })
    })


})

//get reset token from user details
//reset token - correct details
describe('resetToken test', function(){

    let token1 = ''

    it('should be ok if token is valid', function(done) {
        User.findOne({email: 'be2@testing.com'}).exec((err,user) => {
            token1 = user.resetToken
            agent.get(`/user/reset/${user.resetToken}`)
            .end((err, res) => {
                if(err){
                    console.log('err',err);
                }
                res.should.have.property('status').equal(200)
                done()
            })
        })
    })


    it('shouldn\'t be ok if token is invalid', function(done) {
        agent.get(`/user/reset/sdvkmsdfawejf`)
        .end((err, res) => {
            if(err){
                console.log('err',err);
            }
            res.should.have.property('status').equal(401)
            done()
        })
    })

    it('shouldn\'t update user, if no user', function(done) {
        agent.put(`/user/askjdna`)
        .send({
            email: 'alsdasdkjfsk',
            password: 'newone'
        })
        .end((err, res) => {
            if(err){
                console.log('err',err);
            }
            res.should.have.property('status').equal(404)
            done()
        })
    })

    it('shouldn\'t update user, if token invalid', function(done) {
        agent.put(`/user/askjdna`)
        .send({
            email: 'be2@testing.com',
            password: 'newone'
        })
        .end((err, res) => {
            if(err){
                console.log('err',err);
            }
            res.should.have.property('status').equal(404)
            done()
        })
    })

    it('should update user, if token matches', function(done) {
        this.timeout(10000)
        agent.put(`/user/${token1}`)
        .send({
            email: 'be2@testing.com',
            password: 'newone'
        })
        .end((err, res) => {
            if(err){
                console.log('err',err);
            }
            // console.log('res.body',res.body);
            res.should.have.property('status').equal(200)
            done()
        })
    })

    it('shouldn\'t update afterwards', function(done) {
        this.timeout(10000)
        agent.put(`/user/${token1}`)
        .send({
            email: 'be2@testing.com',
            password: 'warning'
        })
        .end((err, res) => {
            if(err){
                console.log('err',err);
            }
            // console.log('res.body',res.body);
            res.should.have.property('status').equal(404)
            done()
        })
    })

})