const TicketModel = require('../models/ticket')

const addTicket = (req) => {
    console.log(req.user._id)
    req.body.userId = req.user._id
    req.body.practitionerId = 'chris_white_12@hotmail.com'
    return new TicketModel(req.body)
}

const getAllTickets = () => {
    tickets = TicketModel.find()
    console.log(tickets)
    return tickets
}

const findTicket = (req) => {
    console.log('email: '+ req.user.email)
    if(req.user.role == 'admin'){
        console.log('admin')
        return TicketModel.find({practitionerId: req.user.email})
    }
    else{
        return TicketModel.find({userId: req.user._id})
    }
}

const updateTicket = (req) => {
    return TicketModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
}

module.exports = {
    getAllTickets,
    findTicket,
    addTicket,
    updateTicket
}