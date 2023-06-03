const CustomErrors = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { createJwtCookies } = require('../utils/jwt');

const register = async (req, res) => {
  const { email, password, firstName, lastName, username, role } = req.body;

  //Check that the user input is not empty
  if (!email || !password || !firstName || !lastName || !username)
    throw new CustomErrors.BadRequestError('Fill in all credential');

  //Check if user already exists
  if (await User.findOne({ email })) throw new CustomErrors.BadRequestError('This user already exist');

  //Create User
  const user = await User.create({ email, password, username, profile: { firstName, lastName }, role });
  const payload = {
    username: user.username,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    role: user.role,
  };
  await createJwtCookies({ res, payload });
  //Response
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  // req.login(user, (error) => {
  //   if (error) return next(error);

  //   return res.status(200).json({ msg: 'You have successfully logged in ' });
  // });

  res.status(StatusCodes.OK).json({ msg: 'You have successfully logged in' });
};

const logout = async (req, res) => {
  req.logOut((error) => error && console.log(error));
  res.redirect('/');
};

module.exports = { register, login, logout };
