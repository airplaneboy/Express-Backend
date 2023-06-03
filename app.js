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
const requireAuth = require('./utils/requireAuth');

//Import Routes
const { authRouter, userRouter, adminRouter } = require('./routes/routes');

//Use Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));
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

//Use routes
configurePassport(passport);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', requireAuth, userRouter);

app.use(notFound);
app.use(errorHandler);

start(app);
