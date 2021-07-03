// const mongoose = require('mongoose');
// const { getUserByEmail, isAdmin, isLoggedIn } = require('../utils/auth_utils')
// const Ticket = require('../models/ticket');
// const User = require('../models/user')
// const request = require('supertest')

// let chai = require('chai')
// let sinon = require('sinon')
// let sinonChai = require('sinon-chai')
// let chaiHttp = require('chai-http')
// let should = chai.should()
// let expect = chai.expect


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

//     // describe("getUserByEmail", () => {
//     //     it('should return on entry from email', () => {
//     //         req = {
//     //             body: {
//     //                 email: "test@test.com"
//     //             }
//     //         }
//     //         getUserByEmail(req).exec((err,user) => {
//     //             if(err){
//     //                 console.log(err)
//     //             }
//     //             else{
//     //                 console.log('update', user)
//     //             }
//     //             expect(user.patId).to.equal('abc123')
//     //         })
//     //     })
//     // })

//     // describe("isAdmin", () => {
//     //     it("should return next() if admin", () => {
//     //         let req = {
//     //             user: {
//     //                 role: 'admin'
//     //             }
//     //         }
//     //         let nextSpy = sinon.spy()

//     //         isAdmin(req,{},nextSpy)
//     //         expect(nextSpy.calledOnce).to.be.true
//     //     })
//     //     it("should return 403 status if not admin", () => {
//     //         let req = {
//     //             user: {
//     //                 role: ''
//     //             }
//     //         }
//     //         let res = {}
//     //         let nextSpy = sinon.spy()

//     //         isAdmin(req,res,nextSpy)
//     //         expect(res.status).to.equal(403)
//     //     })
//     // })

//     // describe("isLoggedIn", () => {
//     //     it("should return next() if logged in", () => {
//     //         let req = {
//     //             user: {
//     //                 role: 'admin'
//     //             }
//     //         }
//     //         let nextSpy = sinon.spy()

//     //         isLoggedIn(req,{},nextSpy)
//     //         expect(nextSpy.calledOnce).to.be.true
//     //     })
//     //     it("should return 403 status if not logged in", () => {
//     //         let req = {}
//     //         let res = {}
//     //         let nextSpy = sinon.spy()

//     //         isLoggedIn(req,res,nextSpy)
//     //         expect(res.status).to.equal(403)
//     //     })
//     // })

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

// //should be able to register with correct details

// //should throw error when user not in cliniko

// //checkUser - if patient

// //checkUser - if practitioner

// //checkUser - invalid user

// //login with correct details

// //login with incorrect details

// //logout

// //forgot password should return ok if correct email (get token)

// //forgot password - incorrect email

// //reset token - correct details

// //reset token - no user

// //reset token - expired token

// // token updateUser - token matches and updates user

// //token updateUser - no user

// //token updateUser - token doesn't match

