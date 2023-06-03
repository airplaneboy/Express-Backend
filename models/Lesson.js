const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoURL: { type: String },
    duration: String,
    sequence: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.Schema('Lesson', LessonSchema);
