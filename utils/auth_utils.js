const UserModel = require('../models/user');

const getUserByEmail = (req) => {
    return UserModel.findOne({"email": req.body.email})
}

module.exports = {
    getUserByEmail
}