const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Name cannot exceed 30 characters'],
    minLength: [4, 'Name should be more then 5 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    // unique: true,
    default: 'example@gmail.com',
    validate: [validator.isEmail, 'Please Enter a valid email'],
  },
  phone: {
    type: Number,
    required: [true, 'Please enter your phone number'],
    unique: true,
    maxLength: [11, 'phone number cannot exceed 11 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [8, 'Name should be more then 8 characters'],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
  },
});

userScheme.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userScheme.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

userScheme.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// forget password

module.exports = mongoose.model('User', userScheme);
