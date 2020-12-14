const ProfileModel = require('../models/profile')

const addProfile = function (req){
    req.body.userId = req.user._id
    req.body.email = req.user.email
    return new ProfileModel(req.body)
}

const findProfile = (req) => {
    return ProfileModel.findOne({userId: req.user._id})
}

const updateProfile = (req) => {
    const userId = req.user._id
    return ProfileModel.findOneAndUpdate({userId: userId}, req.body, {
        new: true
    });
}


module.exports = {
    addProfile,
    findProfile,
    updateProfile
}