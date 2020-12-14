const crypto =require('crypto');

const UserModel = require("../models/user")
const passport = require('passport')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const {
    getUserByEmail
} = require('../utils/auth_utils')

const register = function (req, res, next) {
    
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
    
    const {email,password} = req.body
    UserModel.find({email})
        .then((exist_user) => {
            console.log('exist_user',exist_user.length)
            if(exist_user.length == 0){
                UserModel.create({
                    email,
                    password,
                    resetToken: ''
                })
                .then(newUserHandler)
                //get user information from api

                //create new profile

            }
            else{
                res.sendStatus(400)
            }
        })
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
    console.log(req.body.email)

    getUserByEmail(req).exec((err,user) => {
        if (err) {
            res.status(404)
            res.send("User not found")
        }
        else if(user){
            const token = crypto.randomBytes(20).toString('hex')

            UserModel.findOneAndUpdate({"email": req.body.email},{
                $set:{
                    resetToken: token
                }
            }).exec((err,userUpdate) => {
                if(err){
                    console.log('err',err)
                }
                else{
                    console.log('updated user')
                }
            })
            console.log(token)

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.TEST_EMAIL,
                    pass: process.env.TEST_PASS
                }
            });

            const mailOptions = {
                from: process.env.TEST_EMAIL,
                to: `${user.email}`,
                subject: 'Reset Password',
                text: `To reset password, click the link below: \n http://localhost:3000/reset_password/${token} \n`
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
        if(user){
            console.log(user)
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
    console.log('token', req.params.token)
    //find user
    getUserByEmail(req).exec((err,user) => {
        if (err) {
            res.status(404)
            res.send("User not found")
        }
        else{
            if(user && user.resetToken == req.params.token){
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
    //hash password

    //update user



}

module.exports = {
    register,
    login: loginUser,
    logout,
    forgotPassword,
    resetToken,
    updateUser
};