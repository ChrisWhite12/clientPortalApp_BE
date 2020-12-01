const passport = require('passport')
const LocalStrategy = require('passport-local')
const UserModel = require('../models/user')

passport.serializeUser((user,done) => {
    done(null, user._id)
})

passport.deserializeUser((userId,done) => {
    UserModel.findById(userId)
    .then((user) => done(null,user))
    .catch(done)
})

const canLogin = (user, password) => {
    if(user){
        return user.verifyPasswordSync(password)    //from mongoose-bcrypt
    }
    else{
        return false
    }
}

const verifyCallback = (email,password,done) => {
    UserModel.findOne({email})
    .then((user) => {
        if(canLogin(user,password)){
            return done(null, user)
        }
        else{
            return done(null,false)
        }
    })
    .catch(done)
}

const fields = { usernameField: "email"}

passport.use(new LocalStrategy(fields, verifyCallback))