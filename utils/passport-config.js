const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/User');

const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const configurePassport = async (passport) => {
  //Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      if (!email || !password) return done(null, false);
      const user = await Users.findOne({ email });
      if (!user) return done(null, false);
      if (!(await user.verifyPassword(password))) return done(null, false);
      done(null, user);
    })
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (userId, done) => {
    const user = await Users.findById(userId);
    done(null, user);
  });

  //JWT Strategy
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await Users.findOne({ id: jwt_payload.sub });
      if (!user) return done(null, false);
      // or you could create a new account
      if (user) return done(null, user);
    })
  );
};

module.exports = configurePassport;
