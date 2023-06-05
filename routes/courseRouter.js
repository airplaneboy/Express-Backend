const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { getLessonsByCourse } = require('../controllers/LessonController');

router.route('/').get(getAllCourses).post(createCourse);
router.route('/:courseId').get(getCourse).patch(updateCourse).delete(deleteCourse);
router.route('/:courseId/lessons').get(getLessonsByCourse);

module.exports = router;
