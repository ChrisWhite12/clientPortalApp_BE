const express = require('express');
const router = express.Router();
const { readPatient, updatePatient, getPractitionersApp } = require("../controllers/api_controller")


router.get('/patient', readPatient)
router.get('/practitioner/appointments', getPractitionersApp)
router.put('/patient', updatePatient)
module.exports = router