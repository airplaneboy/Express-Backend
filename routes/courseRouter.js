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
const { authorizePermissions } = require('../middlewares/authorizePermissions');

router.route('/').get(getAllCourses).post(authorizePermissions('admin'), createCourse);
router
  .route('/:courseId')
  .get(getCourse)
  .patch(authorizePermissions('admin'), updateCourse)
  .delete(authorizePermissions('admin'), deleteCourse);
router.route('/:courseId/lessons').get(getLessonsByCourse);

module.exports = router;
