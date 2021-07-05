const crypto =require('crypto');

const User = require("../models/user")
const ProfileModel = require("../models/profile")

const passport = require('passport')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const {
    getUserByEmail
} = require('../utils/auth_utils');
const { getPatientByEmail } = require('./api_controller');

const register = async (req, res, next) => {
    const {email,password} = req.body
    const patId = req.patId
    const pracId = req.pracId
    const role = req.role

    const newUserHandler = (user) => {
        console.log('register new user')
        req.login(user, (err) => {
            if(err){
                next(err)
            }
            else{
                res.sendStatus(201)
            }
        })
    }

    try{
        const existUser = await User.findOne({email})
        if(!existUser){
            const newUser = await User.create({
                email,
                password,
                resetToken: '',
                role,
                patId,
                pracId
            })
            newUserHandler(newUser)
        }
        else{
            res.status(400)
            res.json({
                error: 'Email already exists'
            })
        }
    }
    catch (err){
        res.status(400)
        res.json({message: err.message})
    }
};

function logout(req, res) {
    req.session.destroy(() => {
        res.sendStatus(200);
    });
}

// helper functions
const authenticate = passport.authenticate('local');

function loginUser(req, res, next) {
    // passport.authenticate returns a function that we will call with req, res, and a callback function to execute on success   
    authenticate(req, res, () => {
        // console.log('authenticated', req.user.email);
        // console.log('session object:', req.session);
        // console.log('req.user:', req.user);
        res.status(200);
        res.json({user: req.user});
    });
}

function forgotPassword(req,res){
    getUserByEmail(req).exec((err,user) => {
        if (err) {
            res.status(404)
            res.send("User not found")
        }
        else if(user){
            const token = crypto.randomBytes(20).toString('hex')
            let expToken = new Date(Date.now() + (1000 * 60 * 2))

            User.findOneAndUpdate({"email": req.body.email},{
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

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.TEST_EMAIL,
                    pass: process.env.TEST_PASS
                }
            });

            const resetLink = process.env.NODE_ENV === 'production' ? `https://zealous-mcnulty-b23006.netlify.app/reset_password/${token}` : `http://localhost:3000/reset_password/${token}`
            
            let mailOptions = {
                from: process.env.TEST_EMAIL,
                subject: 'Reset Password',
                to: `${user.email}`,
                html: `<p>To reset password, click the link below: </p> \n <a href=${resetLink}>Reset Password</a> \n`
            }

            transporter.sendMail(mailOptions, (err,res2) => {
                if(err){
                    console.log(`ERROR: ${err}`)
                    res.sendStatus(400)
                }
                else{
                    // console.log('res2',res2);
                    res.status(200)
                    res.json({message:'recovery mail sent'})
                }
            })            
        }
        else{
            res.sendStatus(401)
        }

    })        
}

function resetToken(req,res){
    User.findOne({resetToken: req.params.token})
    .then((user) => {
        const nowDate = new Date(Date.now())
        if(user && ((user.expireToken - nowDate) > 0)){
            res.status(200).json({message: 'link ok'})
        }
        else{
            res.status(401).json({message: 'link not ok'})
        }
    })
    .catch((err) => {
        res.status(401).json({message: 'link not ok'})
    })
}

function updateUser(req,res){
    //find user
    getUserByEmail(req).exec((err,user) => {
        if (err) {
            res.status(404)
            res.json({message: "User not found"})
        }
        else{
            if(user && req.params.token !== '' && user.resetToken == req.params.token){
                console.log('token matches')
                User.findOneAndUpdate({"email": req.body.email},{
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
            
                        transporter.sendMail(mailOptions, (err,res2) => {
                            if(err){
                                console.log(`ERROR: ${err}`)
                                res.sendStatus(400)
                            }
                            else{
                                res.status(200).send({message:'recovery mail sent'})
                            }
                        })
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
    //find user
    getUserByEmail(req).exec((err,user) => {
        if (err) {
            res.status(404)
            res.send("User not found")
        }
        else{
            if(user && req.body.role){
                console.log('In update user - role')
                User.findOneAndUpdate({"email": req.body.email},{
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
    User.find()
    .then((users) => {
        if(users){
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