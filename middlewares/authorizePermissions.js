const CustomErrors = require('../errors');

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErrors.UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};

module.exports = {
  authorizePermissions,
};
