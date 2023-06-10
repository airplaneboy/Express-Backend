const express = require('express');
const router = express.Router();
const passport = require('passport');

const { register, login, logout, refreshToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', passport.authenticate('local', { failureRedirect: '/error' }), login);
router.post('/refresh-token', refreshToken);
router.delete('/logout', logout);

router.get('/error', (req, res) => {
  console.log('Custom error: An error occurred');
  res.status(400).json({ msg: 'Custom error: An error occurred' });
});

module.exports = router;
