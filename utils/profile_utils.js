const ProfileModel = require('../models/profile')

const addProfile = () => {
    return new ProfileModel(req.body)
}

const findProfile = (req) => {
    return ProfileModel.find({userId: req.params.userId})
}


module.exports = {
    addProfile,
    findProfile
}