const TicketModel = require('../models/ticket')

const addTicket = (req) => {
    console.log(req.user._id)
    req.body.userId = req.user._id
    return new TicketModel(req.body)
}

const getAllTickets = () => {
    tickets = TicketModel.find()
    console.log(tickets)
    return tickets
}

const findTicket = (req) => {
    return TicketModel.find({userId: req.user._id})
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