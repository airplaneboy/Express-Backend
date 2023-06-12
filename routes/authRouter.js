const express = require('express');
const router = express.Router();
const passport = require('passport');

const { register, login, logout, refreshToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', passport.authenticate('local'), login);
router.get('/refresh-token', refreshToken);
router.delete('/logout', passport.authenticate('jwt', { session: false }), logout);

module.exports = router;
