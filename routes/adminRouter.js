const express = require('express');
const { getAllUsers } = require('../controllers');

const router = express.Router();
router.get('/', getAllUsers);

module.exports = router;
