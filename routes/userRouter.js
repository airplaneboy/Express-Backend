const express = require('express');
const router = express.Router();
const {
  getUser,
  findUser,
  updateUser,
  updatePassword,
  deleteUser,
  userProfile,
  updateUserProfile,
  findProfile,
} = require('../controllers/');

router.route('/me').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/me/password').patch(updatePassword);
router.route('/me/profile').get(userProfile).patch(updateUserProfile);
router.route('/:id').get(findUser);
router.route('/:id/profile').get(findProfile);

module.exports = router;
