const Course = require('../models/Course');
const User = require('../models/User');
const CustomErrors = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { merge } = require('lodash');

const getAllCourses = async (req, res) => {
  const courses = await Course.find({});
  if (!courses) throw new CustomErrors.NotFoundError('There was an error');
  res.status(StatusCodes.OK).json({ nbHits: courses.length, courses });
};

const getCourse = async (req, res) => {
  const courseId = req.params.courseId;
  if (!courseId) throw new CustomErrors.BadRequestError(`No course with ID: ${courseId}`);

  const course = await Course.findById(courseId);
  if (!course) throw new CustomErrors.NotFoundError('No course was found');
  res.status(StatusCodes.OK).json(course);
};

const createCourse = async (req, res) => {
  const { title, description, instructor } = req.body;

  if (!title || !description || !instructor)
    throw new CustomErrors.BadRequestError('Course needs title, description, and instructor');

  if (await Course.findOne({ title }))
    throw new CustomErrors.BadRequestError('Course with same title already exists. Choose a different title');

  const course = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json(course);
};

const updateCourse = async (req, res) => {
  const courseId = req.params.courseId;
  if (!req.body || !courseId) throw new CustomErrors.BadRequestError('Update course body and courseID cannot be empty');
  let course = await Course.findById(courseId);
  if (!course) throw new CustomErrors.NotFoundError('No course was found');
  course = merge(course, req.body);
  await course.save();
  res.status(StatusCodes.OK).json(course);
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;
  if (!courseId) throw new CustomErrors.BadRequestError(`No course with ID: ${courseId}`);
  await Course.findByIdAndDelete(courseId);
  res.status(StatusCodes.OK).json({ msg: 'Course was successfully deleted' });
};

const getUserCourses = async (req, res) => {
  const userId = req.params.userId;
  const courses = await User.findById(userId).select('enrolledCourses');
  if (!courses) throw new CustomErrors.NotFoundError(`No user with ID: ${userId}`);
  res.status(StatusCodes.OK).json({ nbHits: courses, courses });
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getUserCourses,
};
