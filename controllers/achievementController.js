const { StatusCodes } = require('http-status-codes');
const CustomErrors = require('../errors');
const { merge } = require('lodash');
const Achievement = require('../models/Achievement');

const getAllAchievements = async (req, res) => {
  const achievements = await Achievement.find({});
  if (!achievements) throw new CustomErrors.BadRequestError('There was an error');
  res.status(StatusCodes.OK).json({ nbHits: achievements.length, achievements });
};

const getAchievement = async (req, res) => {
  const achievementId = req.params.achievementId;
  const achievement = await Achievement.findById(achievementId);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${achievementId} not found`);
  res.status(StatusCodes.OK).json(achievement);
};

const createAchievement = async (req, res) => {
  const { name, description, requirement } = req.body;
  if (!name || !description || !requirement)
    throw new CustomErrors.BadRequestError('Name, Description, and Requirement field cannot be empty');

  if (await Achievement.findOne({ name }))
    throw new CustomErrors.BadRequestError('Achievement with same title already exists. Choose a different title');

  const achievement = await Achievement.create(req.body);
  res.status(StatusCodes.OK).json({ msg: 'Successfully created achievement', achievement });
};

const updateAchievement = async (req, res) => {
  const achievementId = req.params.achievementId;
  let achievement = await Achievement.findById(achievementId);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${achievementId} not found`);
  achievement = merge(achievement, req.body);
  await achievement.save();
  res.status(StatusCodes.OK).json(achievement);
};

const deleteAchievement = async (req, res) => {
  const achievementId = req.params.achievementId;
  const achievement = await Achievement.findByIdAndDelete(achievementId);
  if (!achievement) throw new CustomErrors.NotFoundError(`Achievement with ID: ${achievementId} not found`);
  res.status(StatusCodes.OK).json({ msg: 'Successfully deleted achievement' });
};

module.exports = { getAchievement, getAllAchievements, createAchievement, updateAchievement, deleteAchievement };
