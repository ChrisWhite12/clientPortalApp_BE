const express = require('express');
const router = express.Router();
const { readPatient, updatePatient, getPractitioners } = require("../controllers/api_controller")


router.get('/patient', readPatient)
router.get('/practitioner/appointments/:id', getPractitioners)
router.put('/patient', updatePatient)
module.exports = router