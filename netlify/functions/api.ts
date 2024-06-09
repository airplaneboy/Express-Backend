// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from 'express';
import serverless from 'serverless-http';
import { app } from '../../app';
const connectDB = require('../../database/connectDB');
const api = express();

const router = Router();
router.get('/hello', (req, res) => res.send('Hello World!'));

app.use('/api/', router);

await connectDB(process.env.MONGO_URI);
export const handler = serverless(app);
