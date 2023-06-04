const { StatusCodes } = require('http-status-codes');

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Login is required' });
  next();
};

module.exports = requireAuth;
