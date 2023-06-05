const express = require('express');
const router = express.Router();
const {
  getAchievement,
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');

router.route('/').get(getAllAchievements).post(createAchievement);
router.route('/:achievementId').get(getAchievement).patch(updateAchievement).delete(deleteAchievement);

module.exports = router;
