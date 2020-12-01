const UserModel = require("../models/user")
const passport = require('passport')

const registerNew = (req,res) => {
    res.render('auth/register')
}

const registerCreate = (req, res) => {
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

    const { email, password } = req.body
    UserModel.create({
        email,
        password
    })
    .then(newUserHandler)
    

}

const logOut = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

const loginNew = (req,res) => {
    res.render("auth/login")
}

const loginCreate = (req,res, next) => {
    const loginFunc = passport.authenticate('local', {
       successRedirect: "/",
       failureRedirect: "/user/login"
    })
    loginFunc(req, res, next)
}

module.exports = {
    registerNew,
    registerCreate,
    logOut,
    loginCreate,
    loginNew
}