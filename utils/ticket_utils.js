const TicketModel = require('../models/ticket')

const addTicket = (req) => {
    req.body.userId = req.user._id
    return new TicketModel(req.body)
}

const getAllTickets = () => {
    tickets = TicketModel.find()
    return tickets
}

const findTickets = (req) => {
    if(req.user.role == 'admin'){
        return TicketModel.find()           
    }
    else{
        return TicketModel.find({userId: req.user._id})
    }
}

const findTicket = (req) => {
    return TicketModel.findOne({appId: req.params.appId})
}

const updateTicket = (req) => {
    return TicketModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
}

const deleteTicket = (req) => {
    return TicketModel.findByIdAndRemove(req.params.id);
}

module.exports = {
    getAllTickets,
    findTickets,
    findTicket,
    addTicket,
    updateTicket,
    deleteTicket
}