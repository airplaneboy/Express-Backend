const CustomErrors = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Users = require('../models/User');
const { merge } = require('lodash');

//Current User
const getAllUsers = async (req, res) => {
  const user = await Users.find({}).select('-password');
  if (!user) throw new CustomErrors.BadRequestError('Unable to get users');
  res.status(StatusCodes.OK).json({ nbHits: user.length, user });
};

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
  let user = await Users.findById(req.user.userId).select(['-password', '-profile']);
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  delete req.body.password && delete req.body.profile && delete req.body.role;
  user = merge(user, req.body);
  await user.save();
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
  res.status(StatusCodes.OK).json({ msg: 'User successfully deleted' });
};

//Users
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
  delete req.body.password && delete req.body.profile && delete req.body.role;
  user = merge(user, req.body);
  await user.save();
  res.status(200).json({ user });
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new CustomErrors.BadRequestError('Input the new and current passwords');
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

//Profiles
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
  user.profile = _.merge(user.profile, req.body);
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
  user.profile = _.merge(user.profile, req.body);
  await user.save();
  res.status(200).json({ user, body: req.body });
};

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
};
