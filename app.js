//Packages
require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const start = require('./services/startFunction');
const session = require('express-session');
const passport = require('passport');
const configurePassport = require('./utils/passport-config');
const { notFound, errorHandler } = require('./middlewares');

//Import Routes
const {
  authRouter,
  userRouter,
  adminRouter,
  courseRouter,
  lessonRouter,
  achievementRouter,
  searchRouter,
} = require('./routes/routes');

//Use Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.ACCESS_TOKEN_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 14 * 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/protected',
  passport.authenticate('jwt', { session: false, failureRedirect: `${process.env.ROOT_URL}/auth/refresh-token` }),
  (req, res) => {
    // If the JWT is valid, the user will be stored in req.user
    res.json({ msg: 'Accessed protected route', user: req.user });
  }
);

//Use routes
configurePassport(passport);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/api/v1/courses', passport.authenticate('jwt', { session: false }), courseRouter);
app.use('/api/v1/lessons', passport.authenticate('jwt', { session: false }), lessonRouter);
app.use('/api/v1/achievements', passport.authenticate('jwt', { session: false }), achievementRouter);
app.use('/api/v1/search', passport.authenticate('jwt', { session: false }), searchRouter);

app.use(notFound);
app.use(errorHandler);

start(app);
