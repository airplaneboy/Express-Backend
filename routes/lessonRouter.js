const express = require('express');
const router = express.Router();
const {
  createLesson,
  getLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
} = require('../controllers/LessonController');

router.route('/').get(getAllLessons).post(createLesson);
router.route('/:lessonId').get(getLesson).patch(updateLesson).delete(deleteLesson);

module.exports = router;
