const connectDB = require('../database/connectDB');

const port = process.env.PORT || 3000;
const start = async (app) => {
  //Connect to the database
  await connectDB(process.env.MONGO_URI);
  //Listen on port number
  app.listen(port, () => console.log(`> Server is listening on port ${port}...`));
};

module.exports = start;
