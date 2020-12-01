const express = require('express');
const router = express.Router();
const { registerCreate, registerNew, logOut, loginCreate, loginNew } = require('../controllers/auth_controller')
const { authRedirect } = require("../middleware/auth_mw")

router.get('/register', authRedirect ,registerNew)

router.post('/register', registerCreate)

router.get('/logout', logOut)

router.get('/login', authRedirect , loginNew)

router.post('/login', loginCreate)

module.exports = router