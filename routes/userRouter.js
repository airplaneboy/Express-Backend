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
} = require('../controllers/userController');

router.route('/').get(getAllUsers);
router.route('/profiles').get(getAllProfiles);
router.route('/me').get(getCurrentUser).patch(updateCurrentUser).delete(deleteCurrentUser);
router.route('/me/password').patch(updateCurrentPassword);
router.route('/me/profile').get(getCurrentProfile).patch(updateCurrentProfile);
router.route('/:userId').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/:userId/password').patch(updatePassword);
router.route('/:userId/profile').get(getProfile).patch(updateProfile);

module.exports = router;
