const crypto =require('crypto');

const UserModel = require("../models/user")
const ProfileModel = require("../models/profile")

const passport = require('passport')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const {
    getUserByEmail
} = require('../utils/auth_utils');
const { getPatientByEmail } = require('./api_controller');

const register = function (req, res, next) {
    
    const {email,password} = req.body
    const patId = req.patId
    const role = req.role
    const newUserHandler = (user) => {
        console.log('register new user')
        req.login(user, (err) => {
            if(err){
                next(err)
            }
            else{
                res.redirect('/')
            }
        })
    }

    UserModel.find({email})
        .then((exist_user) => {
            console.log('exist_user',exist_user.length)
            if(exist_user.length == 0){
                UserModel.create({
                    email,
                    password,
                    resetToken: '',
                    role,
                    patId
                })
                .then(newUserHandler)
            }
            else{
                res.status(400)
                res.json({
                    error: 'Email already exists'
                })
            }
        })
        .catch(err => console.log(err))
    // next()
};

function logout(req, res) {
    console.log('in logout func')
    req.session.destroy(() => {
        res.redirect("/");
    });
}
// const logout = function (req, res) {
//     console.log(req)
//     req.logout();
//     console.log('logged out user');
//     console.log('session object:', req.session);
//     console.log('req.user:', req.user);
//     // res.redirect('/user/login')
//     res.sendStatus(200);
// }

// helper functions
const authenticate = passport.authenticate('local');

function loginUser(req, res, next) {
    // passport.authenticate returns a function that we will call with req, res, and a callback function to execute on success   
    console.log('in login user') 
    authenticate(req, res, () => {
        console.log('authenticated', req.user.username);
        console.log('session object:', req.session);
        console.log('req.user:', req.user);
        res.status(200);
        res.json({user: req.user, sessionID: req.sessionID});
    });
}

function forgotPassword(req,res){
    // console.log(req.body)
    // console.log(req.body.email)

    getUserByEmail(req).exec((err,user) => {
        if (err) {
            res.status(404)
            res.send("User not found")
        }
        else if(user){
            const token = crypto.randomBytes(20).toString('hex')
            let nowDate = new Date(Date.now())
            let expToken = new Date(Date.now() + (1000 * 60 * 2))
            console.log('now - ',nowDate.toString(),'expToken - ',expToken.toString())

            UserModel.findOneAndUpdate({"email": req.body.email},{
                $set:{
                    resetToken: token,
                    expireToken: expToken
                }
            }).exec((err,userUpdate) => {
                if(err){
                    console.log('err',err)
                }
                else{
                    console.log('updated user')
                }
            })
            // console.log(token)

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.TEST_EMAIL,
                    pass: process.env.TEST_PASS
                }
            });

            let mailOptions = {
                from: process.env.TEST_EMAIL,
                subject: 'Reset Password',
                to: `${user.email}`,
                text: `To reset password, click the link below: \n http://localhost:3000/reset_password/${token} \n`
            }

            // console.log(mailOptions)

            transporter.sendMail(mailOptions, (err,res) => {
                if(err){
                    console.log(`ERROR: ${err}`)
                    res.sendStatus(400)
                }
                else{
                    // console.log(res)
                    res.status(200).send({message:'recovery mail sent'})
                }
            })
            res.sendStatus(200)
            
        }
        else{
            res.sendStatus(400)
        }

    })        
}

function resetToken(req,res){
    UserModel.findOne({resetToken: req.params.token})
    .then((user) => {
        const nowDate = new Date(Date.now())
        console.log(user.expireToken - nowDate)
        if(user && ((user.expireToken - nowDate) > 0)){
            console.log('expToken - ',user.expireToken)
            res.status(200).send({message: 'link ok'})
        }
        else{
            res.status(401).send({message: 'link not ok'})
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(401).send({message: 'link not ok'})
    })
}

function updateUser(req,res){
    // console.log('token', req.params.token)
    //find user
    getUserByEmail(req).exec((err,user) => {
        if (err) {
            res.status(404)
            res.send("User not found")
        }
        else{
            if(user && req.params.token != '' && user.resetToken == req.params.token){
                console.log('token matches')
                UserModel.findOneAndUpdate({"email": req.body.email},{
                    $set:{
                        password: req.body.password,
                        resetToken: null
                    }
                }).exec((err,userUpdate) => {
                    if(err){
                        console.log('err',err)
                        res.status(400)
                        res.send("Error")
                    }
                    else{
                        console.log('updated password')
                        //send password reset email

                        const transporter = nodemailer.createTransport({
                            host: 'smtp.ethereal.email',
                            port: 587,
                            auth: {
                                user: process.env.TEST_EMAIL,
                                pass: process.env.TEST_PASS
                            }
                        });

                        let mailOptions = {
                            from: process.env.TEST_EMAIL,
                            subject: 'Reset Password',
                            to: `${user.email}`,
                            text: `Your password has been reset for BrainTrain dashboard \n`
                        }
            
                        transporter.sendMail(mailOptions, (err,res) => {
                            if(err){
                                console.log(`ERROR: ${err}`)
                                res.sendStatus(400)
                            }
                            else{
                                // console.log(res)
                                res.status(200).send({message:'recovery mail sent'})
                            }
                        })

                        res.status(200).send("password set")
                    }
                })
            }
            else{
                res.status(404)
                res.send("User not found")
            }
        }
    })
}

function updateUserAdmin(req,res){
    // console.log('token', req.params.token)
    //find user
    getUserByEmail(req).exec((err,user) => {
        if (err) {
            res.status(404)
            res.send("User not found")
        }
        else{
            if(user && req.body.role){
                console.log('In update user - role')
                UserModel.findOneAndUpdate({"email": req.body.email},{
                    $set:{
                        role: req.body.role
                    }
                }).exec((err,userUpdate) => {
                    if(err){
                        console.log('err',err)
                        res.status(400)
                        res.send("Error")
                    }
                    else{
                        console.log('updated role')
                        res.status(200).send("role set")
                    }
                })
            }
            else{
                res.status(404)
                res.send("User not found")
            }
        }
    })
}

function readUsers (req,res){
    UserModel.find()
    .then((users) => {
        if(users){
            // console.log(users)
            res.status(200).send(users)
        }
        else{
            res.status(401).send({message: 'unauthorized'})
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(401).send({message: err})
    })
}

module.exports = {
    register,
    login: loginUser,
    logout,
    forgotPassword,
    resetToken,
    updateUser,
    readUsers,
    updateUserAdmin
};