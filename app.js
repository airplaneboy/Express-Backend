//Packages
require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const start = require('./services/startFunction');
const { notFound, errorHandler } = require('./middlewares');

//Import Routes
const { authRouter } = require('./routes/routes');

//Use Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));

//Use routes
app.use('/api/v1/auth', authRouter);
app.use(notFound, errorHandler);

start(app);
