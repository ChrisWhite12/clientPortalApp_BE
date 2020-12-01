const UserModel = require("../models/user")
const passport = require('passport')

const register = function (req, res) {
    
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
        password
    })
    .then(newUserHandler)

    // User.register(new User({
    //     email: req.body.email,
    //     role: req.body.role || 'user'
    // }), req.body.password, function (err) {
    //     if (err) {
    //         console.log(err)
    //         res.status(500);
    //         res.json({
    //             error: err
    //         });
    //     } else {
    //         // Log in the newly registered user
    //         loginUser(req, res);
    //     }
    // });
};

const logout = function (req, res) {
    console.log(req)
    req.logout();
    console.log('logged out user');
    console.log('session object:', req.session);
    console.log('req.user:', req.user);
    res.sendStatus(200);
}

// helper functions
const authenticate = passport.authenticate('local');

function loginUser(req, res) {
    // passport.authenticate returns a function that we will call with req, res, and a callback function to execute on success    

    authenticate(req, res, function () {
        console.log('authenticated', req.user.username);
        console.log('session object:', req.session);
        console.log('req.user:', req.user);
        res.status(200);
        res.json({user: req.user, sessionID: req.sessionID});
    });
}

module.exports = {
    register,
    login: loginUser,
    logout
};