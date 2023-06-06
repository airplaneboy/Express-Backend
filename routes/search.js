const express = require('express');
const router = express.Router();
const { searchLesson, searchCourse, searchUser, searchAchievement } = require('../controllers/searchController');

router.get('/lessons', searchLesson);
router.get('/courses', searchCourse);
router.get('/users', searchUser);
router.get('/achievements', searchAchievement);

module.exports = router;
