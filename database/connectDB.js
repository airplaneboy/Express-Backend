const mongoose = require('mongoose');

const connectDB = async (uri) => {
  await mongoose.connect(uri).then(() => console.log('> Successfully connected to the database...'));
};

module.exports = connectDB;
