const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User schema
const Ticket = new Schema({
    appId:{
        type: String,
        required: true
    },
    appDate:{
        type: String,
        required: true
    },
    appTime:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    notified:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Ticket', Ticket)