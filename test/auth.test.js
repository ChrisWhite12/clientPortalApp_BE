const chai = require('chai')
const User = require('../models/user')
const mongoose = require('mongoose');

let should = chai.should()
process.env.NODE_ENV = 'test'

const { app, server } = require('../app')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const agent = chai.request.agent(app)

//should be able to register with correct details
describe("register", () => {    

    it('should login with valid user', (done) =>{
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
    
    it("shouldn't register with invalid user", function (done){
        this.timeout(10000)
        agent.post('/user/register')
        .send({
            email: 'asdf@asdf.com',
            password: 'asdf123'
        })
        .end((err, res) => {
            res.should.have.property('status').equal(401)
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
            console.log('res.body',res.body);
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


//reset token - correct details

//reset token - no user

//reset token - expired token

//token updateUser - token matches and updates user

//token updateUser - no user

//token updateUser - token doesn't match



// chai.use(sinonChai)

// const {
//     connectToDb,
//     disconnectFromDb
// } = require('./config');

// describe('auth Utils test', () => {

//     before(async () => {
//         // await connectToDb();
//         mongoose.connection.on( err => {
//             console.log('error connecting to db')
//         })
//         await Ticket.deleteMany()
//         await User.deleteMany()
//         await setupData();
//     });

//     after(() => {
//         disconnectFromDb();
//     })


//     describe("example test - running auth.test.js", () => {
//         it("example test", () => {
//             (1).should.equal(1);
//         })
//     })

    // describe("getUserByEmail", () => {
    //     it('should return on entry from email', () => {
    //         req = {
    //             body: {
    //                 email: "test@test.com"
    //             }
    //         }
    //         getUserByEmail(req).exec((err,user) => {
    //             if(err){
    //                 console.log(err)
    //             }
    //             else{
    //                 console.log('update', user)
    //             }
    //             expect(user.patId).to.equal('abc123')
    //         })
    //     })
    // })

    // describe("isAdmin", () => {
    //     it("should return next() if admin", () => {
    //         let req = {
    //             user: {
    //                 role: 'admin'
    //             }
    //         }
    //         let nextSpy = sinon.spy()

    //         isAdmin(req,{},nextSpy)
    //         expect(nextSpy.calledOnce).to.be.true
    //     })
    //     it("should return 403 status if not admin", () => {
    //         let req = {
    //             user: {
    //                 role: ''
    //             }
    //         }
    //         let res = {}
    //         let nextSpy = sinon.spy()

    //         isAdmin(req,res,nextSpy)
    //         expect(res.status).to.equal(403)
    //     })
    // })

    // describe("isLoggedIn", () => {
    //     it("should return next() if logged in", () => {
    //         let req = {
    //             user: {
    //                 role: 'admin'
    //             }
    //         }
    //         let nextSpy = sinon.spy()

    //         isLoggedIn(req,{},nextSpy)
    //         expect(nextSpy.calledOnce).to.be.true
    //     })
    //     it("should return 403 status if not logged in", () => {
    //         let req = {}
    //         let res = {}
    //         let nextSpy = sinon.spy()

    //         isLoggedIn(req,res,nextSpy)
    //         expect(res.status).to.equal(403)
    //     })
    // })

// })

// const setupData = async () => {
//     // create patient user
//     const user1 = await User.create({
//         email: 'test@test.com',
//         password: 'testtest',
//         resetToken: '',
//         role: '',
//         patId: 'abc123'
//     })

// }

//checkUser - if patient

//checkUser - if practitioner

//checkUser - invalid user


