
const {addTicket, findTicket, findTickets, updateTicket, deleteTicket} = require('../utils/ticket_utils')

const createTicket = function(req,res) {
    addTicket(req).save((err,ticket) => {
        if (err) {
            res.status(500)
            res.json({
                error: err.message
            })
        }
        else{
            res.status(201)
            res.send({ticId: ticket._id})
        }
    })
}

const readTickets = function(req,res){
    findTickets(req).exec((err,ticket) => {
        if (err) {
			res.status(500)
			res.json({
				error: err.message
			})
        }
        else{
            res.status(200)
            res.send(ticket)
        }
    })
}

const readTicket = function(req,res){
    findTicket(req).exec((err,ticket) => {
        if (err) {
			res.status(500)
			res.json({
				error: err.message
			})
        }
        else{
            res.status(200)
            res.send(ticket)
        }
    })
}

const changeTicket = function(req,res){
    updateTicket(req).exec((err,ticket) => {
        if (err) {
			res.status(500)
			res.json({
				error: err.message
			})
        }
        else{
            res.status(200)
            res.send(ticket)
        }
    })

}

const removeTicket = function(req,res){
    deleteTicket(req).exec(err => {
        if (err) {
            res.status(500)
            res.json({
                error: err.message
            })
        }
        else{
            res.sendStatus(204)
        }
    })
}

module.exports = {
    createTicket,
    readTickets,
    readTicket,
    changeTicket,
    removeTicket
}