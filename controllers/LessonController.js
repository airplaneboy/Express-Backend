const { StatusCodes } = require('http-status-codes');
const CustomErrors = require('../errors');
const { merge } = require('lodash');
const Lesson = require('../models/Lesson');

const createLesson = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description)
    throw new CustomErrors.BadRequestError('Lesson title, description, and courseId is required');
  const lesson = await Lesson.create(req.body);
  res.status(StatusCodes.CREATED).json(lesson);
};

const getLesson = async (req, res) => {
  const lessonId = req.params.lessonId;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${lessonId} not found`);
  res.status(StatusCodes.OK).json(lesson);
};

const updateLesson = async (req, res) => {
  const lessonId = req.params.lessonId;
  let lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${lessonId} not found`);
  lesson = merge(lesson, req.body);
  await lesson.save();
  res.status(StatusCodes.OK).json(lesson);
};

const deleteLesson = async (req, res) => {
  const lessonId = req.params.lessonId;
  const lesson = await Lesson.findByIdAndDelete(lessonId);
  if (!lesson) throw new CustomErrors.NotFoundError(`Lesson with ID: ${lessonId} not found`);
  res.status(StatusCodes.OK).json({ msg: 'Lesson was successfully deleted' });
};

const getAllLessons = async (req, res) => {
  const lessons = await Lesson.find({});
  if (!lessons) throw new CustomErrors.NotFoundError('There was an error');
  res.status(StatusCodes.OK).json({ nbHits: lessons.length, lessons });
};

const getLessonsByCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const lessons = await Lesson.find({ course: courseId });
  if (!lessons) throw new CustomErrors.NotFoundError(`Lesson with ID: ${lessonId} not found`);
  res.status(StatusCodes.OK).json({ nbHits: lessons.length, lessons });
};

module.exports = { createLesson, getLesson, updateLesson, deleteLesson, getAllLessons, getLessonsByCourse };
