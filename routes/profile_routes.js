const express = require('express');
const router = express.Router();
const { createProfile } = require('../controllers/profile_controller')

router.post('/create', createProfile )

module.exports = router