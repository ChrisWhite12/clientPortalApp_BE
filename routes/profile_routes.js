const express = require('express');
const router = express.Router();
const { createProfile, changeProfile, readProfile } = require('../controllers/profile_controller')

router.get('/', readProfile)
router.post('/', createProfile)
router.put('/update', changeProfile)

module.exports = router