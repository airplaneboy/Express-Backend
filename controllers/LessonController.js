const { StatusCodes } = require('http-status-codes');
const CustomErrors = require('../errors');
const _ = require('lodash');
const Lesson = require('../models/Lesson');

const createLesson = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) throw new CustomErrors.BadRequestError('Video title and description is required');
  const lesson = await Lesson.create(req.body);
  res.status(StatusCodes.CREATED).json(lesson);
};

const getLesson = async (req, res) => {
  const id = req.params.id;
  const lesson = await Lesson.findById(id);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${id} not found`);
  res.status(StatusCodes.OK).json(lesson);
};

const updateLesson = async (req, res) => {
  const id = req.params.id;
  const lesson = await Lesson.findById(id);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${id} not found`);
  lesson = _.merge(lesson, req.body);
  await lesson.save();
  res.status(StatusCodes.OK).json(lesson);
};

const deleteLesson = async (req, res) => {
  const id = req.params.id;
  const lesson = await Lesson.findByIdAndDelete(id);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${id} not found`);
  res.status(StatusCodes.OK).json({ msg: 'Lesson was successfully deleted' });
};

const getAllLessons = async (req, res) => {
  const lessons = await Lesson.find({});
  if (!lessons) throw new CustomErrors.NotFoundError('There was an error');
  res.status(Status.OK).json(lessons);
};

const getLessonsByCourse = async (req, res) => {
  const courseId = req.params.id;
  const lessons = await Lesson.find({ course: courseId });
  if (!lessons) throw new CustomErrors.NotFoundError(`Lesson with ID: ${id} not found`);
  res.status(StatusCodes.OK).json(lessons);
};

module.exports = { createLesson, getLesson, updateLesson, deleteLesson, getAllLessons, getLessonsByCourse };
