const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  name: { type: String, required: [true, ['Achievement name cannot be empty']], unique: true },
  description: { type: String, required: [true, ['Achievement description cannot be empty']] },
  imageURL: { type: String },
  requirement: { type: [String], required: true },
});

module.exports = mongoose.model('Achievement', AchievementSchema);
