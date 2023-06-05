const { StatusCodes } = require('http-status-codes');
const CustomErrors = require('../errors');
const _ = require('lodash');
const Achievement = require('../models/Achievement');

const getAllAchievements = async (req, res) => {
  const achievements = await Achievement.find({});
  if (!achievements) throw new CustomErrors.BadRequestError('There was an error');
  res.status(StatusCodes.OK).json(achievements);
};

const getAchievement = async (req, res) => {
  const id = req.params.id;
  const achievement = await Achievement.findById(id);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${id} not found`);
  res.status(StatusCodes.OK).json(achievement);
};

const createAchievement = async (req, res) => {
  const { name, description, requirement } = req.body;
  if (!name || !description || !requirement)
    throw new CustomErrors.BadRequestError('Name, Description, and Requirement field cannot be empty');

  const achievement = await Achievement.create(req.body);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${id} not found`);
  res.status(StatusCodes.OK).json(achievement);
};

const updateAchievement = async (req, res) => {
  const id = req.params.id;
  const achievement = await Achievement.findById(id);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${id} not found`);
  achievement = _.merge(achievement, req.body);
  await achievement.save();
  res.status(StatusCodes.OK).json(achievement);
};

const deleteAchievement = async (req, res) => {
  const id = req.params.id;
  const achievement = await Achievement.findByIdAndDelete(id);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${id} not found`);
  res.status(StatusCodes.OK).json({ msg: 'Successfully deleted achievement' });
};

module.exports = { getAchievement, getAllAchievements, createAchievement, updateAchievement, deleteAchievement };
