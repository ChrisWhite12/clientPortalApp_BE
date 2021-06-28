const express = require('express');
const router = express.Router();
const { createTicket, readTicket, changeTicket, removeTicket, readTickets} = require('../controllers/ticket_controller')

router.post('/', createTicket)
router.get('/', readTickets)
router.get('/:appId', readTicket)
router.put('/:id', changeTicket)
router.delete('/:id', removeTicket)

module.exports = router