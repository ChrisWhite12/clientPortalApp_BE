const express = require('express');
const router = express.Router();
const { readPatient } = require("../controllers/api_controller")


router.get('/patient', readPatient)
module.exports = router