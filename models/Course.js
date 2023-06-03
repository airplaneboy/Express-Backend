const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: [true, 'Course title cannot be empty'], maxlength: 300 },
    description: { type: String, required: [true, 'Course description cannot be empty'], maxlength: 500 },
    duration: Number,
    tags: [String],
    instructor: { type: String, required: true },
    lessons: { type: [mongoose.Types.ObjectId] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
