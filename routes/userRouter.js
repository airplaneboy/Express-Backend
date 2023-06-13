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
  enrollUserToCourse,
  enrollCurrentUserToCourse,
} = require('../controllers/userController');
const { getUserCourses } = require('../controllers/courseController');

const { authorizePermissions } = require('../middlewares/authorizePermissions');

router.route('/').get(authorizePermissions('admin'), getAllUsers);
router.route('/profiles').get(authorizePermissions('admin'), getAllProfiles);
router.route('/me').get(getCurrentUser).patch(updateCurrentUser).delete(deleteCurrentUser);
router.route('/me/password').patch(updateCurrentPassword);
router.route('/me/profile').get(getCurrentProfile).patch(updateCurrentProfile);
router.route('/me/enroll').post(enrollCurrentUserToCourse);
router.route('/enroll/:userId').post(authorizePermissions('admin'), enrollUserToCourse);
router
  .route('/:userId')
  .get(getUser)
  .patch(authorizePermissions('admin'), updateUser)
  .delete(authorizePermissions('admin'), deleteUser);
router.route('/:userId/courses').get(getUserCourses);
router.route('/:userId/password').patch(authorizePermissions('admin'), updatePassword);
router.route('/:userId/profile').get(getProfile).patch(authorizePermissions('admin'), updateProfile);

module.exports = router;
