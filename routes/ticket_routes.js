const express = require('express');
const router = express.Router();
const { createTicket } = require('../controllers/ticket_controller')

router.post('/create', createTicket)

module.exports = router