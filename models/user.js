const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User schema
const User = new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String
    },
    resetToken:{
        type: String,
        required: false
    },
    patId:{
        type: String
    }
})

User.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model('User', User)