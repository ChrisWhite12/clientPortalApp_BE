const express = require('express');
const router = express.Router();
const { register, login, logout, forgotPassword, resetToken} = require('../controllers/auth_controller')
const { authRedirect } = require('../middleware/auth_mw')

// router.get('/register', authRedirect ,registerNew)

router.post('/register', register)
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot_password', forgotPassword)
router.get('/reset/:id', resetToken)

module.exports = router