const Course = require('../models/Course');
const CustomErrors = require('../errors');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const getAllCourses = async (req, res) => {
  const courses = await Course.find({});
  if (!courses) throw new CustomErrors.NotFoundError('There was an error');
  res.status(StatusCodes.OK).json(courses);
};

const getCourse = async (req, res) => {
  const id = req.params.courseId;
  if (!id) throw new CustomErrors.BadRequestError(`No course with ID: ${id}`);

  const course = await Course.findById(id);
  if (!course) throw new CustomErrors.NotFoundError('No course was found');
  res.status(StatusCodes.OK).json(course);
};

const createCourse = async (req, res) => {
  const { title, description, instructor } = req.body;

  if (!title || !description || !instructor)
    throw new CustomErrors.BadRequestError('Course needs title, description, and instructor');

  const course = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json(course);
};

const updateCourse = async (req, res) => {
  const id = req.params.courseId;
  if (!req.body || !id) throw new CustomErrors.BadRequestError('Update course body and courseID cannot be empty');
  let course = await Course.findById(id);
  if (!course) throw new CustomErrors.NotFoundError('No course was found');
  course = _.merge(course, req.body);
  await course.save();
  res.status(StatusCodes.OK).json(course);
};

const deleteCourse = async (req, res) => {
  const id = req.params.id;
  if (!id) throw new CustomErrors.BadRequestError(`No course with ID: ${id}`);
  await Course.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json({ msg: 'Course was successfully deleted' });
};

//TODO: Make final decision on this
const getLessonsByCourse = async (req, res) => {
  const id = req.params.id;
  const lessons = await Course.findById(id).select('lessons').populate('lessons');
  if (!lessons) throw new CustomErrors.NotFoundError(`No course with ID: ${id}`);
  res.status(StatusCodes.OK).json(lessons);
};

module.exports = { createCourse, getAllCourses, getCourse, updateCourse, deleteCourse };
