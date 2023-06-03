const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  name: { type: String, required: [true, ['Achievement name cannot be empty']] },
  description: { type: String, required: [true, ['Achievement description cannot be empty']] },
  imageURL: { type: String },
  requirement: { type: [String] },
});

module.exports = mongoose.model('Achievement', AchievementSchema);
