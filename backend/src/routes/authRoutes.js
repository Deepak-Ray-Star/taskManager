const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateSignup, validateLogin, validateRequest } = require('../middleware/validators');

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, validateRequest, signup);
router.post('/login', validateLogin, validateRequest, login);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router;
