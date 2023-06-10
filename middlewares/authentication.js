const CustomErrors = require('../errors');
const { isTokenValid } = require('../utils');
const Token = require('../models/Token');
const { createJwtAccessAndRefreshCookies } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
  const { refresh_token, access_token } = req.signedCookies;
  try {
    if (access_token) {
      const payload = await isTokenValid(access_token);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refresh_token);

    const token = await Token.findOne({ _id: payload.user.userId, refreshToken: payload.refreshToken });

    if (!token || !token?.isValid) throw new CustomErrors.UnauthenticatedError('Authentication Invalid');

    createJwtAccessAndRefreshCookies({ res, payload: payload.payload, refreshToken: token.refreshToken });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new CustomErrors.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErrors.UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
