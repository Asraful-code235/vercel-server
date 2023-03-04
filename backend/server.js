const app = require('./app');

const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database');
const dotenv = require('dotenv').config({ path: 'backend/config/config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
