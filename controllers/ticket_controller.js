
const {addTicket, findTicket, updateTicket, deleteTicket} = require('../utils/ticket_utils')

const createTicket = function(req,res) {
    addTicket(req).save((err,ticket) => {
        if (err) {
			res.status(500)
			res.json({
				error: err.message
			})
		}
        res.sendStatus(201)
        console.log(ticket)
    })
}

const readTicket = function(req,res){
    console.log('read ticket - controller')
    findTicket(req).exec((err,ticket) => {
        if (err) {
			res.status(500)
			res.json({
				error: err.message
			})
        }
        res.send(ticket)
        console.log(ticket)
    })
}

const changeTicket = function(req,res){
    console.log('updating ticket - controller')
    updateTicket(req).exec((err,ticket) => {
        if (err) {
			res.status(500)
			res.json({
				error: err.message
			})
        }
        res.status(200)
        res.send(ticket)
        console.log(ticket)
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
        res.sendStatus(204)
    })
}

module.exports = {
    createTicket,
    readTicket,
    changeTicket,
    removeTicket
}