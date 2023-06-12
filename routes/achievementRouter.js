const express = require('express');
const router = express.Router();
const {
  getAchievement,
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');
const { authorizePermissions } = require('../middlewares/authorizePermissions');

router.route('/').get(getAllAchievements).post(authorizePermissions('admin'), createAchievement);
router
  .route('/:achievementId')
  .get(getAchievement)
  .patch(authorizePermissions('admin'), updateAchievement)
  .delete(authorizePermissions('admin'), deleteAchievement);

module.exports = router;
