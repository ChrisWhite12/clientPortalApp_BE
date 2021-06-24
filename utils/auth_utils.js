const User = require('../models/user');

const getUserByEmail = (req) => {
    return User.findOne({"email": req.body.email})
}

const isAdmin = (req,res,next) => {
    if (req.user.role === 'admin') return next();
    else res.sendStatus(403);
}

const isLoggedIn = (req,res,next) => {
    if (req.user) return next();
    else res.sendStatus(403);
}

module.exports = {
    getUserByEmail,
    isAdmin,
    isLoggedIn
}