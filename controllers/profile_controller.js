

const UserModel = require("../models/profile")
const {addProfile} = require('../utils/profile_utils')

const createProfile = (req,res) => {
    addProfile(req).save((err,profile) => {
        if (err) {
			res.status(500)
			res.json({
				error: err.message
			})
		}
        res.sendStatus(201)
        console.log(profile)
    })
}


module.exports = {
    createProfile
}