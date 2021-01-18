const mongoose = require('mongoose');
const { getUserByEmail, isAdmin, isLoggedIn } = require('../utils/auth_utils')
const Ticket = require('../models/ticket');
const User = require('../models/user')
const request = require('supertest')

let chai = require('chai')
let sinon = require('sinon')
let sinonChai = require('sinon-chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let expect = chai.expect


chai.use(sinonChai)

const {
    connectToDb,
    disconnectFromDb
} = require('./config');

describe('main test', () => {

    before(async () => {
        await connectToDb();

        await Ticket.deleteMany()
        await User.deleteMany()
        await setupData();
    });

    after(() => {
        disconnectFromDb();
    })


    describe("example test - running auth_util.test.js", () => {
        it("example test", () => {
            (1).should.equal(1);
        })
    })

    describe("getUserByEmail", () => {
        it('should return on entry from email', () => {
            req = {
                body: {
                    email: "test@test.com"
                }
            }
            getUserByEmail(req).exec((err,user) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log('update', user)
                }
                expect(user.patId).to.equal('abc123')
            })
        })
    })

    describe("isAdmin", () => {
        it("should return next() if admin", () => {
            let req = {
                user: {
                    role: 'admin'
                }
            }
            let nextSpy = sinon.spy()

            isAdmin(req,{},nextSpy)
            expect(nextSpy.calledOnce).to.be.true
        })
        it("should return 403 status if not admin", () => {
            let req = {
                user: {
                    role: ''
                }
            }
            let res = {}
            let nextSpy = sinon.spy()

            isAdmin(req,res,nextSpy)
            expect(res.status).to.equal(403)
        })
    })

    describe("isLoggedIn", () => {
        it("should return next() if logged in", () => {
            let req = {
                user: {
                    role: 'admin'
                }
            }
            let nextSpy = sinon.spy()

            isLoggedIn(req,{},nextSpy)
            expect(nextSpy.calledOnce).to.be.true
        })
        it("should return 403 status if not logged in", () => {
            let req = {}
            let res = {}
            let nextSpy = sinon.spy()

            isLoggedIn(req,res,nextSpy)
            expect(res.status).to.equal(403)
        })
    })

})

const setupData = async () => {
    date1 = new Date(2021, 1, 1, 8, 0, 0);

    // create patient user
    user1 = await User.create({
        email: 'test@test.com',
        password: 'testtest',
        resetToken: '',
        role: '',
        patId: 'abc123'
    })

}

// const isLoggedIn 