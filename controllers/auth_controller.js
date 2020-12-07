const crypto =require('crypto');

const UserModel = require("../models/user")
const passport = require('passport')
const nodemailer = require('nodemailer')

const {
    getUserByEmail
} = require('../utils/auth_utils')


const register = function (req, res, next) {
    
    const newUserHandler = (user) => {
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
    UserModel.create({
        email,
        password,
        resetToken: ''
    })
    .then(newUserHandler)
};

const logout = function (req, res) {
    console.log(req)
    req.logout();
    console.log('logged out user');
    console.log('session object:', req.session);
    console.log('req.user:', req.user);
    // res.redirect('/user/login')
    res.sendStatus(200);
}

// helper functions
const authenticate = passport.authenticate('local');

function loginUser(req, res, next) {
    // passport.authenticate returns a function that we will call with req, res, and a callback function to execute on success    
    // const loginFunc = passport.authenticate("local", {
    //     successRedirect: "/dashboard",
    //     failureRedirect: "/auth/login"
    // })
    // loginFunc(req, res, next)

    authenticate(req, res, () => {
        console.log('authenticated', req.user.username);
        console.log('session object:', req.session);
        console.log('req.user:', req.user);
        res.status(200);
        res.json({user: req.user, sessionID: req.sessionID});
    });
}

function forgotPassword(req,res){
    console.log(req.body.email)
    if(req.body.email == ''){
        res.status(400).send('email required')
    }
    else{
        getUserByEmail(req).exec((err,user) => {
            if (err) {
                res.status(404)
                res.send("User not found")
            }
            else{
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
                        user: 'derrick59@ethereal.email',
                        pass: 'BSrY4bYy5Cm1h1uy8A'
                    }
                });

                const mailOptions = {
                    from: 'derrick59@ethereal.email',
                    to: `${user.email}`,
                    subject: 'Reset Password',
                    text: `To reset password, click the link below: \n http://localhost:3000/reset_password/${token} \n`
                }

                transporter.sendMail(mailOptions, (err,res) => {
                    if(err){
                        console.log(`ERROR: ${err}`)
                    }
                    else{
                        console.log(res)
                        res.status(200).send('recovery mail sent')
                    }
                })
                
            }

        })
                    
    }
}

function resetToken(req,res){
    UserModel.findOne({resetToken: req.params.id})
    .then((user) => {
        if(user){
            console.log(user)
            res.status(200).send({message: 'link ok'})
        }
        else{
            console.log(err)
            res.status(401).send({message: 'link not ok'})
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(401).send({message: 'link not ok'})
    })
}

module.exports = {
    register,
    login: loginUser,
    logout,
    forgotPassword,
    resetToken
};