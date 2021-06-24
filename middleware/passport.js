const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')

passport.serializeUser((user,done) => {
    done(null, user.id)             //_id
})

passport.deserializeUser(async(userId,done) => {
    try{
        const user = await User.findById(userId)
        done(null,user)
    }
    catch (err){
        done(err)
    }
})

const canLogin = (user, password) => {
    if(user){
        return user.verifyPasswordSync(password)    //from mongoose-bcrypt - boolean
    }
    else{
        return false
    }
}

const verifyCallback = async (email,password,done) => {
    try{
        const findUser = await User.findOne({email})
        if(canLogin(findUser,password)){
            return done(null, findUser)         //success
        }
        else{
            return done(null,false)         //unsuccessful
        }
    }
    catch (err){
        done(err)
    }   
}

//use local strategy
passport.use(new LocalStrategy({usernameField: "email"}, verifyCallback))