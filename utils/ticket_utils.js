const TicketModel = require('../models/ticket')

const addTicket = (req) => {
    console.log(req.user._id)
    req.body.userId = req.user._id
    return new TicketModel(req.body)
}

const getAllTickets = () => {
    tickets = TicketModel.find()
    // console.log('getTickets - ',tickets)
    return tickets
}

const findTicket = (req) => {
    console.log('email: '+ req.user.email)
    if(req.user.role == 'admin'){
        console.log('admin')
        return TicketModel.find()
    }
    else{
        return TicketModel.find({userId: req.user._id})
    }
}

const updateTicket = (req) => {
    console.log('id -> ', req.params)
    return TicketModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
}

const deleteTicket = (req) => {
    return TicketModel.findByIdAndRemove(req.params.id);
}

module.exports = {
    getAllTickets,
    findTicket,
    addTicket,
    updateTicket,
    deleteTicket
}