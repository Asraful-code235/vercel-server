const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //  useCreateIndex: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    // shut down serer due to unhandled issues
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDatabase;
