// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

const express = require('express');
const serverless = require('serverless-http');
const app = require('../../app');
const connectDB = require('../../database/connectDB');

const router = express.Router();

app.use('/', router);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to DB');
  } catch (error) {
    console.log(error);
  }
};
start();
export const handler = serverless(app);
