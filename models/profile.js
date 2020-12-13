const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User schema
const Profile = new Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    contact:{
        type: String
    },
    Address:{
        type: String
    },
    userId:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Profile', Profile)