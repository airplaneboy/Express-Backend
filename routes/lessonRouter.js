const express = require('express');
const router = express.Router();
const {
  createLesson,
  getLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
} = require('../controllers/LessonController');
const { authorizePermissions } = require('../middlewares/authorizePermissions');

router.route('/').get(getAllLessons).post(authorizePermissions('admin'), createLesson);
router
  .route('/:lessonId')
  .get(getLesson)
  .patch(authorizePermissions('admin'), updateLesson)
  .delete(authorizePermissions('admin'), deleteLesson);

module.exports = router;
