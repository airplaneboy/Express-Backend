const mongoose = require('mongoose');
const bcryptJS = require('bcryptjs');
const validator = require('validator');
const UserSchema = new mongoose.Schema(
  {
    //Primary
    username: {
      type: String,
      required: [true, 'Input a username'],
      unique: true,
      minlength: [3, 'Username is too short'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Input a valid email'],
      unique: true,
      maxlength: [254, 'Email is too long'],
      verified: Boolean,
      trim: true,
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: 'Invalid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Input a valid password'],
      maxlength: 300,
      trim: true,
      //TODO: comment out before prod
      validate: {
        validator: (value) => {
          const options = {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          };

          return validator.isStrongPassword(value, options);
        },
        message: 'Password does not meet the strength requirements',
      },
    },
    profile: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      pictureUrl: String, //why not use buffer?
      bio: String,
      country: String,
      language: String,
      phone: {
        number: String,
        verified: Boolean,
      },
      socials: {
        twitter: String,
        github: String,
        facebook: String,
      },
      birthday: Date,
    },
    role: {
      required: true,
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
    },

    //Additional
    completedLessons: { type: [mongoose.Schema.Types.ObjectId], ref: 'Lesson' },

    currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },

    enrolledCourses: { type: [mongoose.Schema.Types.ObjectId], ref: 'Courses' },

    completedCourses: { type: [mongoose.Schema.Types.ObjectId], ref: 'Courses' },

    bookmark: { type: [mongoose.Schema.Types.ObjectId], ref: 'Courses' },

    achievements: { type: [mongoose.Schema.Types.ObjectId], ref: 'Achievement' },

    comments: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
          required: true,
        },
        // Add any other relevant fields like author, replies, etc.
      },
    ],

    notifications: [
      {
        type: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
          required: true,
        },
        // other relevant fields like sender, link, etc.
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  return (this.password = await bcryptJS.hash(this.password, 12));
});

UserSchema.methods.verifyPassword = async function (password) {
  return await bcryptJS.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
