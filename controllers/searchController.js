const CustomErrors = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

const searchLesson = async (req, res) => {
  const query = req.query.q;
  if (!query) throw new CustomErrors.BadRequestError(`Invalid search query: ${query}. Use 'q' as the Query Parameter`);
  const results = await Lesson.find({ title: { $regex: query, $options: 'i' } });
  if (!results) throw new CustomErrors.BadRequestError(`There was an error searching for: ${query}`);
  res.status(StatusCodes.OK).json({ nbHits: results.length, results });
};

const searchCourse = async (req, res) => {
  const query = req.query.q;
  if (!query) throw new CustomErrors.BadRequestError(`Invalid search query: ${query}. Use 'q' as the Query Parameter`);
  const results = await Course.find({ title: { $regex: query, $options: 'i' } });
  if (!results) throw new CustomErrors.BadRequestError(`There was an error searching for: ${query}`);
  res.status(StatusCodes.OK).json({ nbHits: results.length, results });
};

const searchUser = async (req, res) => {
  const query = req.query.q;
  if (!query) throw new CustomErrors.BadRequestError(`Invalid search query: ${query}. Use 'q' as the Query Parameter`);
  const results = await User.find({
    $or: [{ username: { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }],
  });
  if (!results) throw new CustomErrors.BadRequestError(`There was an error searching for: ${query}`);
  res.status(StatusCodes.OK).json({ nbHits: results.length, results });
};

const searchAchievement = async (req, res) => {
  const query = req.query.q;
  if (!query) throw new CustomErrors.BadRequestError(`Invalid search query: ${query}. Use 'q' as the Query Parameter`);
  const results = await Achievement.find({ name: { $regex: query, $options: 'i' } });
  if (!results) throw new CustomErrors.BadRequestError(`There was an error searching for: ${query}`);
  res.status(StatusCodes.OK).json({ nbHits: results.length, results });
};

module.exports = { searchLesson, searchCourse, searchUser, searchAchievement };
