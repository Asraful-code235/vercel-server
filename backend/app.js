const express = require('express');
const { errorHandler } = require('./middleware/errorHandler');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route imports

// const product = require('./routes/productRoute');
const user = require('./routes/userRoutes');
// const order = require('./routes/orderRoute');

// app.use('/api/v1', product);
app.use('/api/v1', user);
// app.use('/api/v1', order);

// middle ware
app.use(errorHandler);

module.exports = app;
