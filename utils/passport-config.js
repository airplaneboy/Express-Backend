const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/userModel');
const CustomErrors = require('../errors');

const configurePassport = async (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      if (!email || !password)
        return done(null, false); /*throw new CustomErrors.BadRequestError('Email and password cannot be empty');*/
      const user = await Users.findOne({ email });
      if (!user) return done(null, false); /*throw new CustomErrors.NotFoundError('This user does not exist');*/
      if (!(await user.verifyPassword(password))) return done(null, false);
      // throw new CustomErrors.UnauthenticatedError('The email and password do not match');
      done(null, user);
    })
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id);
    done(null, user);
  });
};

module.exports = configurePassport;
