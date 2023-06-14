const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getCurrentUser,
  updateCurrentPassword,
  updateCurrentUser,
  deleteCurrentUser,
  getUser,
  updateUser,
  updatePassword,
  deleteUser,
  getAllProfiles,
  getCurrentProfile,
  updateCurrentProfile,
  getProfile,
  updateProfile,
  updateUserCourses,
  updateCurrentUserCourses,
  assignAchievementToCurrentUser,
  assignAchievementToUser,
  updateUserCompletedLessons,
  updateCurrentUserCompletedLessons,
  updateUserCompletedCourses,
  updateCurrentUserCompletedCourses,
  updateCurrentUserCurrentLesson,
  updateUserCurrentLesson,
  deleteCurrentUserCourses,
  deleteUserCourses,
} = require('../controllers/userController');
const { getUserCourses } = require('../controllers/courseController');

const { authorizePermissions } = require('../middlewares/authorizePermissions');

router.route('/').get(authorizePermissions('admin'), getAllUsers);
router.route('/profiles').get(authorizePermissions('admin'), getAllProfiles);
router.route('/me').get(getCurrentUser).patch(updateCurrentUser).delete(deleteCurrentUser);
router.route('/me/password').patch(updateCurrentPassword);
router.route('/me/profile').get(getCurrentProfile).patch(updateCurrentProfile);
router.route('/me/courses').patch(updateCurrentUserCourses).delete(deleteCurrentUserCourses);
router.route('/me/achievements').patch(assignAchievementToCurrentUser);
router.route('/me/completedLessons').patch(updateCurrentUserCompletedLessons);
router.route('/me/completedCourses').patch(updateCurrentUserCompletedCourses);
router.route('/me/currentLesson').put(updateCurrentUserCurrentLesson);
router
  .route('/:userId')
  .get(getUser)
  .patch(authorizePermissions('admin'), updateUser)
  .delete(authorizePermissions('admin'), deleteUser);
router.route('/:userId/achievements').patch(authorizePermissions('admin'), assignAchievementToUser);
router.route('/:userId/courses').get(getUserCourses);
router.route('/:userId/completedLessons').patch(authorizePermissions('admin'), updateUserCompletedLessons);
router.route('/:userId/completedCourses').patch(authorizePermissions('admin'), updateUserCompletedCourses);
router
  .route('/:userId/courses')
  .patch(authorizePermissions('admin'), updateUserCourses)
  .delete(authorizePermissions('admin'), deleteUserCourses);
router.route('/:userId/currentLesson').put(authorizePermissions('admin'), updateUserCurrentLesson);
router.route('/:userId/password').patch(authorizePermissions('admin'), updatePassword);
router.route('/:userId/profile').get(getProfile).patch(authorizePermissions('admin'), updateProfile);

module.exports = router;
