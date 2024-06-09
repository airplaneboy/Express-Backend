// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from 'express';
import serverless from 'serverless-http';

const api = express();

const router = Router();
router.get('/hello', (req, res) => {
  console.log('...hit the hello route');
  return res.send('Hello World!');
});
router.get('/', (req, res) => {
  console.log('...hit the home route');
  return res.json({ home: 'Home Rocks!' });
});

api.use('/api/', router);

export const handler = serverless(api);
