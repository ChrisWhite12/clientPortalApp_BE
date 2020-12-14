const express = require('express');
const router = express.Router();
const { readAppointments, readPatients } = require("../controllers/api_controller")


router.get('/patients', readPatients)
router.get('/appointments', readAppointments)
module.exports = router