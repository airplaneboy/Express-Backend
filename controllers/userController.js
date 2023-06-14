const CustomErrors = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Users = require('../models/User');
const Achievement = require('../models/Achievement');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { merge } = require('lodash');

//Current User
const getCurrentUser = async (req, res) => {
  if (!req.user) throw new CustomErrors.BadRequestError('Login is required');
  const userId = req.user.userId;
  const user = await Users.findById(userId).select('-password');
  if (!user) throw new CustomErrors.NotFoundError('User was not found');
  res.status(StatusCodes.OK).json({ user });
};

const updateCurrentUser = async (req, res) => {
  if (!req.body) throw new CustomErrors.BadRequestError('No valid values to update');
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  let user = await Users.findById(req.user.userId).select(['username', 'email']);
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');

  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;

  await user.save();
  //TODO: Should I Update cookies here
  res.status(200).json({ user });
};

const updateCurrentPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new CustomErrors.BadRequestError('Input the new and current passwords');
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  const user = await Users.findById(req.user.userId).select('password');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  if (!(await user.verifyPassword(currentPassword)))
    throw new CustomErrors.UnauthenticatedError('Input does not match the current password');
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Password successfully updated' });
};

const deleteCurrentUser = async (req, res) => {
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  const user = await Users.findByIdAndDelete(req.user.userId);
  if (!user) throw new CustomErrors.NotFoundError('User was not found');
  //TODO: Logout user here
  res.status(StatusCodes.OK).json({ msg: 'User successfully deleted' });
};

const updateCurrentUserCourses = async (req, res) => {
  const userId = req.user.userId;
  // const courseId = req.body.courseId;
  const courseIds = req.body.courseIds;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');

  if (!Array.isArray(courseIds)) throw new CustomErrors.BadRequestError('courseIds takes an array');

  const errors = [];
  for (const courseId of courseIds) {
    const course = await Course.findById(courseId).catch((err) => {
      errors.push(err.message);
    });

    if (!course) {
      continue;
    }
    if (user.enrolledCourses.includes(courseId)) {
      continue;
    }
    console.log(course.title);
    user.enrolledCourses.push(courseId);
  }
  await user.save();
  return res.status(StatusCodes.OK).json({ msg: 'Successfully enrolled to course', errors });
};

const assignAchievementToCurrentUser = async (req, res) => {
  const userId = req.user.userId;
  const achievementId = req.body.achievementId;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError(`User with ID: ${userId} not found`);

  const achievement = await Achievement.findById(achievementId);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${achievementId} not found`);

  if (Array.isArray(achievementId)) throw new CustomErrors.BadRequestError('achievementId cannot be an array');

  if (user.achievements.includes(achievementId))
    throw new CustomErrors.BadRequestError('This user has already earned this achievement');

  user.achievements.push(achievementId);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: `Successfully assigned achievement (${achievement.name}) to user` });
};

const updateCurrentUserCompletedLessons = async (req, res) => {
  const userId = req.user.userId;
  const lessonId = req.body.lessonId;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError('User was not found');

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${lessonId} was not found`);

  if (Array.isArray(lessonId)) throw new CustomErrors.BadRequestError('lessonId cannot be an array');

  if (user.completedLessons.includes(lessonId))
    throw new CustomErrors.BadRequestError('This lesson has been completed by the user');

  user.completedLessons.push(lessonId);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Successfully updated completed lessons' });
};

const updateCurrentUserCompletedCourses = async (req, res) => {
  const userId = req.user.userId;
  const courseId = req.body.courseId;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError('User was not found');

  const course = await Course.findById(courseId);
  if (!course) throw new CustomErrors.NotFoundError(`Lesson with ID: ${courseId} was not found`);

  if (Array.isArray(courseId)) throw new CustomErrors.BadRequestError('courseId cannot be an array');

  if (user.enrolledCourses.includes(courseId))
    throw new CustomErrors.BadRequestError('This user has already completed this course');

  user.enrolledCourses.push(courseId);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Successfully updated completed courses' });
};

const updateCurrentUserCurrentLesson = async (req, res) => {
  const userId = req.user.userId;
  const lessonId = req.body.lessonId;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError('User was not found');

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${lessonId} was not found`);

  user.currentLesson = lessonId;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Successfully updated current lesson' });
};

//Users
const getAllUsers = async (req, res) => {
  const user = await Users.find({}).select('-password');
  if (!user) throw new CustomErrors.BadRequestError('Unable to get users');
  res.status(StatusCodes.OK).json({ nbHits: user.length, user });
};

const getUser = async (req, res) => {
  const userId = req.params.userId;

  const user = await Users.findById(userId).select('-password');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  if (!req.body) throw new CustomErrors.BadRequestError('No valid values to update');
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  let user = await Users.findById(req.params.userId).select(['-password', '-profile']);
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  delete req.body.password && delete req.body.profile;
  user = merge(user, req.body);
  await user.save();
  res.status(200).json({ user });
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    throw new CustomErrors.BadRequestError('Input the new (newPassword) and current (currentPassword) passwords');
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  const user = await Users.findById(req.params.userId).select('password');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  if (!(await user.verifyPassword(currentPassword)))
    throw new CustomErrors.UnauthenticatedError('Input does not match the current password');
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Password successfully updated' });
};

const deleteUser = async (req, res) => {
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  const user = await Users.findByIdAndDelete(req.params.userId);
  if (!user) throw new CustomErrors.NotFoundError('User was not found');
  res.status(StatusCodes.OK).json({ msg: 'User successfully deleted' });
};

const updateUserCourses = async (req, res) => {
  const userId = req.params.userId;
  const courseIds = req.body.courseIds;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');

  if (!Array.isArray(courseIds)) throw new CustomErrors.BadRequestError('courseIds takes an array');

  const errors = [];
  for (const courseId of courseIds) {
    const course = await Course.findById(courseId).catch((err) => {
      errors.push(err.message);
    });

    if (!course) {
      continue;
    }
    if (user.enrolledCourses.includes(courseId)) {
      continue;
    }
    console.log(course.title);
    user.enrolledCourses.push(courseId);
  }
  await user.save();
  return res.status(StatusCodes.OK).json({ msg: 'Successfully enrolled to course', errors });
};

const assignAchievementToUser = async (req, res) => {
  const userId = req.params.userId;
  const achievementId = req.body.achievementId;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError(`User with ID: ${userId} not found`);

  const achievement = await Achievement.findById(achievementId);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${achievementId} not found`);

  if (Array.isArray(achievementId)) throw new CustomErrors.BadRequestError('achievementId cannot be an array');

  if (user.achievements.includes(achievementId))
    throw new CustomErrors.BadRequestError('This user has already earned this achievement');

  user.achievements.push(achievementId);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: `Successfully assigned achievement (${achievement.name}) to user` });
};

const updateUserCompletedLessons = async (req, res) => {
  const userId = req.params.userId;
  const lessonId = req.body.lessonId;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError('User was not found');

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${lessonId} was not found`);

  if (Array.isArray(lessonId)) throw new CustomErrors.BadRequestError('lessonId cannot be an array');

  if (user.completedLessons.includes(lessonId))
    throw new CustomErrors.BadRequestError('This lesson has been completed by the user');

  user.completedLessons.push(lessonId);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Successfully updated completed lessons' });
};

const updateUserCompletedCourses = async (req, res) => {
  const userId = req.params.userId;
  const courseId = req.body.courseId;

  const user = await Users.findById(userId);
  if (!user) throw new CustomErrors.NotFoundError('User was not found');

  const course = await Course.findById(courseId);
  if (!course) throw new CustomErrors.NotFoundError(`Lesson with ID: ${courseId} was not found`);

  if (Array.isArray(courseId)) throw new CustomErrors.BadRequestError('courseId cannot be an array');

  if (user.enrolledCourses.includes(courseId))
    throw new CustomErrors.BadRequestError('This user has already completed this course');

  user.enrolledCourses.push(courseId);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Successfully updated completed courses' });
};

//#region Profiles
const getAllProfiles = async (req, res) => {
  const profiles = await Users.find({}).select('profile');
  if (!profiles) throw new CustomErrors.BadRequestError('Unable to get users');
  res.status(StatusCodes.OK).json({ nbHits: profiles.length, profiles });
};

const getCurrentProfile = async (req, res) => {
  const user = await Users.findById(req.user.userId).select('profile');
  if (!user) throw new CustomErrors.NotFoundError('User was not found');
  res.status(StatusCodes.OK).json(user);
};

const updateCurrentProfile = async (req, res) => {
  if (!req.body) throw new CustomErrors.BadRequestError('No valid values to update');
  let user = await Users.findById(req.user.userId).select('profile');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  user.profile = merge(user.profile, req.body);
  await user.save();
  res.status(200).json({ user, body: req.body });
};

const getProfile = async (req, res) => {
  let user = await Users.findById(req.params.userId).select('profile');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  res.status(StatusCodes.OK).json(user);
};

const updateProfile = async (req, res) => {
  if (!req.body) throw new CustomErrors.BadRequestError('No valid values to update');
  let user = await Users.findById(req.params.userId).select('profile');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  user.profile = merge(user.profile, req.body);
  await user.save();
  res.status(200).json({ user, body: req.body });
};
//#endregion

module.exports = {
  getAllUsers,
  getCurrentUser,
  updateCurrentPassword,
  updateCurrentUser,
  deleteCurrentUser,
  getUser,
  updateUser,
  updatePassword,
  deleteUser,
  getCurrentProfile,
  updateCurrentProfile,
  getAllProfiles,
  getProfile,
  updateProfile,
  updateUserCourses,
  updateCurrentUserCourses,
  assignAchievementToUser,
  assignAchievementToCurrentUser,
  updateUserCompletedLessons,
  updateCurrentUserCompletedLessons,
  updateUserCompletedCourses,
  updateCurrentUserCompletedCourses,
  updateCurrentUserCurrentLesson,
};
