const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth')

// Setting up the routes
router.post('/register', register)
router.post('/login', login)

module.exports = router;

