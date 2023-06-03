const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    userID: mongoose.Types.ObjectId,
    courseID: mongoose.Types.ObjectId,
    lessonID: mongoose.Types.ObjectId,
    completionStatus: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', ProgressSchema);
