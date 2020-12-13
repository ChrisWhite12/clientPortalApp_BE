const TicketModel = require('../models/ticket')

const addTicket = () => {
    return new TicketModel(req.body)
}

const getAllTickets = () => {
    tickets = TicketModel.find()
    console.log(tickets)
    return tickets
}

const findTicket = (req) => {
    return TicketModel.find({userId: req.params.userId})
}


module.exports = {
    getAllTickets,
    findTicket,
    addTicket
}