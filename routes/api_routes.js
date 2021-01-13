const express = require('express');
const router = express.Router();
const { readPatient, updatePatient } = require("../controllers/api_controller")


router.get('/patient', readPatient)
router.put('/patient', updatePatient)
module.exports = router