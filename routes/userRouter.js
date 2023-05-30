const express = require('express');
const router = express.Router();
const { getUser, findUser, updateUser, updatePassword, deleteUser } = require('../controllers/');

router.route('/me').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/me/password').patch(updatePassword);
router.route('/:id').get(findUser);

// router.route('me/profile').get(userProfile).put(updateProfile);
// router.route(':id/profile/').get(getProfile);

module.exports = router;
