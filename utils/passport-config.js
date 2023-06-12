const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/User');

const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const configurePassport = async (passport) => {
  //#region Local Strategy
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
  //#endregion

  //#region JWT Strategy
  passport.use(
    new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
      const user = jwt_payload;
      // const user = await Users.findOne({ id: jwt_payload.sub });
      if (!user) return done(null, false);
      // or you could create a new account
      return done(null, user);
    })
  );
  //#endregion
};

module.exports = configurePassport;
