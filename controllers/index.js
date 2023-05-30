const { register, login, logout, requireAuth } = require('./authController');
const { getUser, findUser, updateUser, updatePassword, deleteUser } = require('./userController');
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
};
