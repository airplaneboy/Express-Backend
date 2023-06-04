const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

router.route('/').get(getAllCourses).post(createCourse);
router.route('/:courseId').get(getCourse).patch(updateCourse).delete(deleteCourse);

module.exports = router;
