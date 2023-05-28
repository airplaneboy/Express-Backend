const connectDB = require('../database/connectDB');

const port = process.env.PORT || 3000;
const start = async (app) => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`> Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

module.exports = start;
