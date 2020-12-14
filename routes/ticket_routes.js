const express = require('express');
const router = express.Router();
const { createTicket, readTicket, updateTicket } = require('../controllers/ticket_controller')

router.post('/', createTicket)
router.get('/', readTicket)
router.put('/update/:id', updateTicket)

module.exports = router