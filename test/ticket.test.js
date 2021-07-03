
// process.env.NODE_ENV = 'test'

// const mongoose = require('mongoose');
// const { findTicket, getAllTickets, updateTicket, deleteTicket } = require('../utils/ticket_utils');
// const Ticket = require('../models/ticket');
// const User = require('../models/user')
// const request = require('supertest')
// var {app} = require('../app')

// let chai = require('chai')
// let chaiHttp = require('chai-http')
// let should = chai.should()

// const {
//     connectToDb,
//     disconnectFromDb
// } = require('./config');
// const user = require('../models/user');
// const { deleteOne } = require('../models/ticket');

// var user1 = {}
// var user2 = {}
// var user3 = {}
// var tic1 = {}
// var tic2 = {}
// var tic3 = {}

// describe('ticket utils test', () => {
    
//     // Use done to deal with asynchronous code - done is called when the hooks completes
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
    
//     describe("example test - running ticket_util.test.js", () => {
//         it("example test", () => {
//             (1).should.equal(1);
//         })
//     })

//     describe("getAllTickets", () => {
//         it('should have a length of 3', () => {
//             getAllTickets().exec((err,tic) => {
//                 console.log(`tic test - ${tic}`)
//                 console.log(`err test - ${err}`)

//                 tic.should.have.length(3)
//                 if(err){
//                     console.log(err)
//                 }
//             })
//         })
//     })

//     describe("find tickets", () => {
//         it('should find tickets matching to patient', () => {
//             // const response = request(app).get('/ticket')
//             const req = {
//                 user: {
//                     _id: user1._id,
//                     email: user1.email
//                 }
//             }
//             findTicket(req).exec((err,tic) => {
//                 tic.should.have.length(2)
//             })
//         })
//         it('should find all tickets as admin', () => {
//             const req = {
//                 user: {
//                     _id: user2._id,
//                     email: user2.email,
//                     role: 'admin'
//                 }
//             }
//             findTicket(req).exec((err,tic) => {
//                 // console.log(tic)
//                 tic.should.have.length(3)
//             })
//         })
//     })

//     describe("update tickets", () => {
//         it('should update ticket to accept', () => {
//             const req = {
//                 params: {
//                     id: tic1._id
//                 },
//                 body: {
//                     status: 'accepted'
//                 }
//             }
//             updateTicket(req).exec((err,tic) => {
                
//                 if(err){
//                     console.log(err)
//                 }
//                 else{
//                     console.log('update', tic)
//                 }
//             })
//         })
//     })

//     describe("delete tickets", () => {
//         it("should delete a ticket", () => {
//             req = {
//                 params: {
//                     id: tic2._id
//                 }
//             }
//             deleteTicket(req).exec((err,tic) => {
//                 if(err){
//                     console.log(err)
//                 }
//                 else{
//                     console.log('deleted')
//                 }
//             })
//         })
//     })

// })


// // Setup and tear down functions
// const setupData = async () => {
//     // create patient user
//     user1 = await User.create({
//         email: 'test@test.com',
//         password: 'testtest',
//         resetToken: '',
//         role: ''
//     })

//     // create practitioner user
//     user2 = await User.create({
//         email: 'chris_white_12@hotmail.com',
//         password: 'testtest',
//         resetToken: '',
//         role: 'admin'
//     })

//     user3 = await User.create({
//         email: 'user3@test.com',
//         password: 'testtest',
//         resetToken: '',
//         role: ''
//     })
    
//     tic1 = await Ticket.create({
//         appId: 'tic1',
//         userId: user1._id,
//         appDate: new Date(2021, 1, 1, 8, 0, 0),
//         status: 'requested',
//         notified: false
//     })

//     tic2 = await Ticket.create({
//         appId: 'tic2',
//         userId: user1._id,
//         appDate: new Date(2021, 1, 1, 9, 0, 0),
//         status: 'requested',
//         notified: false
//     })

//     tic3 = await Ticket.create({
//         appId: 'tic3',
//         userId: user3._id,
//         appDate: new Date(2021, 1, 1, 10, 0, 0),
//         status: 'requested',
//         notified: false
//     })
//     // console.log("tic3 - ",tic3)
// }

// //create Ticket, correct parameters

// //create Ticket, incorrect parameters

// //read Tickets - admin

// //read Tickets - user

// //read Ticket - appId correct

// //change Ticket - correct details

// //change Ticket - incorrect Id

// //delete Ticket - correct Id

// //delete Ticket - incorrect Id