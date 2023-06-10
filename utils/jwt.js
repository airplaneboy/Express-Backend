const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};

const verifyToken = ({ token, secret }) => jwt.verify(token, secret);

const createJwtAccessAndRefreshCookies = ({ res, payload, refreshToken }) => {
  //Create JWT
  const accessToken = createJWT({ payload: payload });
  const refreshTokenJWT = createJWT({ payload: { payload, refreshToken } });
  const oneDay = 1 * 86400000;
  const thirtyDays = 30 * 86400000;

  //Create Access Token Cookie
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  //Create Refresh Token Cookie
  res.cookie('refresh_token', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + thirtyDays),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  res.status(StatusCodes.OK).json({ msg: 'User successfully logged in', accessToken, refreshToken });
};

const createJwtCookies = ({ res, payload }) => {
  const token = createJWT({ payload });

  // const oneDay = 30 * 1000 * 60 * 60 * 24;
  const oneDay = 30 * 86400000;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

const createRefreshAndAccessToken = ({ res, payload, refreshToken }) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
  });

  if (!refreshToken) return res.status(StatusCodes.OK).json({ msg: 'Successfully created access token', accessToken });

  const refreshTokenJWT = jwt.sign({ payload, refreshToken }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
  });

  // const thirtyDays = 30 * 86400000;
  res.cookie('refresh_token', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + +process.env.REFRESH_TOKEN_COOKIES_EXPIRATION),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Successfully created access and refresh token', accessToken, refreshTokenJWT });
};

module.exports = {
  createJWT,
  verifyToken,
  createJwtCookies,
  createJwtAccessAndRefreshCookies,
  createRefreshAndAccessToken,
};
