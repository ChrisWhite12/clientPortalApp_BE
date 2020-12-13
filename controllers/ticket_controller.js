const UserModel = require("../models/ticket")
const {addTicket} = require('../utils/ticket_utils')

const createTicket = () => {
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


module.exports = {
    createTicket
}