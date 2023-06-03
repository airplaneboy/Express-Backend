const { register, login, logout } = require('./authController');
const {
  getUser,
  findUser,
  updateUser,
  updatePassword,
  deleteUser,
  userProfile,
  updateUserProfile,
  findProfile,
} = require('./userController');
const { getAllUsers } = require('./adminController');

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  getUser,
  findUser,
  updateUser,
  updatePassword,
  deleteUser,
  userProfile,
  updateUserProfile,
  findProfile,
};
