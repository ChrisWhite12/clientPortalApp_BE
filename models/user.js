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
    }
})

User.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model('User', User)