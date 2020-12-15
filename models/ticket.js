const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User schema
const Ticket = new Schema({
    appId:{
        type: String,
        required: true
    },
    appDate:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    notified:{
        type: Boolean,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    practitionerId:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Ticket', Ticket)