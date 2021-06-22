const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/user')

passport.serializeUser((user,done) => {
    done(null, user._id)             //_id
})

passport.deserializeUser((userId,done) => {
    UserModel.findById(userId)
    .then((user) => done(null,user))
    .catch(done)
})

const canLogin = (user, password) => {
    if(user){
        return user.verifyPasswordSync(password)    //from mongoose-bcrypt - boolean
    }
    else{
        return false
    }
}

const verifyCallback = (email,password,done) => {
    UserModel.findOne({email})
    .then((user) => {
        if(canLogin(user,password)){
            return done(null, user)         //success
        }
        else{
            return done(null,false)         //unsuccessful
        }
    })
    .catch(done)                            //error
}

//set username to email
const fields = { usernameField: "email"}

//use local strategy
passport.use(new LocalStrategy(fields, verifyCallback))