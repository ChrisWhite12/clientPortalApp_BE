const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User schema
const Profile = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    contact:{
        type: String,
        required: true
    },
    Address:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Profile', Profile)