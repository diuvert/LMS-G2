const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_app';
  await mongoose.connect(uri);
  return mongoose.connection;
};

module.exports = { connectDB };
