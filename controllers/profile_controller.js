
const {addProfile, findProfile, updateProfile} = require('../utils/profile_utils')

const readProfile = function(req,res){
    console.log('read profile - controller')
    findProfile(req).exec((err,profile) => {
        if (err) {
			res.status(500)
			res.json({
				error: err.message
			})
        }
        res.send(profile)
        console.log(profile)
    })
}

const createProfile = function(req,res) {
    console.log('create profile - controller')
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

const changeProfile = function(req,res){
    console.log('updating profile - controller')
    updateProfile(req).exec((err, profile) => {
        if (err) {
            console.log(err)
            res.status(500)
            res.json({
                error: err.message
            })
        }
        res.status(200)
        res.send(profile)
    })
}


module.exports = {
    createProfile,
    changeProfile,
    readProfile
}