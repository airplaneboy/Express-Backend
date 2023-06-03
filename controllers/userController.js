const CustomErrors = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Users = require('../models/User');
const _ = require('lodash');

const getUser = async (req, res) => {
  const user = await Users.findById(req.user.id).select('-password');
  if (!user) throw new CustomErrors.NotFoundError('User was not found');
  res.status(StatusCodes.OK).json({ user });
};

//TODO: Finds user based on id instead of email or username
const findUser = async (req, res) => {
  const id = req.params.id;

  //TODO: try this
  // const params = req.params;
  // const user = await Users.findOne(params).select('-password');

  if (!id) throw new CustomError.BadRequestError('Input user ID');
  const user = await Users.findOne({ _id: id }).select('-password');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  if (!req.body) throw new CustomErrors.BadRequestError('No valid values to update');
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  let user = await Users.findById(req.user.id).select(['-password', '-profile']);
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  delete req.body.password && delete req.body.profile && delete req.body.role;
  user = _.merge(user, req.body);
  await user.save();
  res.status(200).json({ user });
};
//TODO: Add a more secure way to change password by validating tokens
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new CustomErrors.BadRequestError('Input the new and current passwords');
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  const user = await Users.findById(req.user.id).select('password');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  if (!(await user.verifyPassword(currentPassword)))
    throw new CustomErrors.UnauthenticatedError('Input does not match the current password');
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Password successfully updated' });
};

const deleteUser = async (req, res) => {
  if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
  const user = await Users.findByIdAndDelete(req.user.id);
  if (!user) throw new CustomErrors.NotFoundError('User was not found');
  res.status(StatusCodes.OK).json({ msg: 'User successfully deleted' });
};

//Confirm password then delete
// const deleteUser = async (req, res) => {
//   const { currentPassword } = req.body;
//   if (!currentPassword) throw new CustomErrors.BadRequestError('Input password to proceed');
//   if (!req.user) throw new CustomErrors.BadRequestError('Login is needed');
//   const user = await Users.findById(req.user.id);
//   if (!user) throw new CustomErrors.NotFoundError('User was not found');
//   if (!(await user.verifyPassword(currentPassword)))
//     throw new CustomErrors.UnauthenticatedError('Passwords do not match');
//   user.deleteOne();
//   await user.save();
//   res.status(StatusCodes.OK).json({ msg: 'User has been deleted' });
// };

const userProfile = async (req, res) => {
  const user = await Users.findById(req.user.id).select('profile');
  if (!user) throw new CustomErrors.NotFoundError('User was not found');
  res.status(StatusCodes.OK).json(user);
};

const updateUserProfile = async (req, res) => {
  if (!req.body) throw new CustomErrors.BadRequestError('No valid values to update');
  let user = await Users.findById(req.user.id).select('profile');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  user.profile = _.merge(user.profile, req.body);
  await user.save();
  res.status(200).json({ user, body: req.body });
};

const findProfile = async (req, res) => {
  let user = await Users.findById(req.params.id).select('profile');
  if (!user) throw new CustomErrors.NotFoundError('This user does not exist');
  res.status(StatusCodes.OK).json(user);
};

module.exports = {
  getUser,
  findUser,
  updateUser,
  updatePassword,
  deleteUser,
  userProfile,
  updateUserProfile,
  findProfile,
};
