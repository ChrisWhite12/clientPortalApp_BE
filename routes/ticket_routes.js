const express = require('express');
const router = express.Router();
const { createTicket, readTicket, changeTicket, removeTicket} = require('../controllers/ticket_controller')

router.post('/', createTicket)
router.get('/', readTicket)
router.put('/:id', changeTicket)
router.delete('/:id', removeTicket)

module.exports = router