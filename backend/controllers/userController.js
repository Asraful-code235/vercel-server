const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');

const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register user

exports.registerUser = asyncHandler(async (req, res, next) => {
  const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
    folder: 'spauser',
    width: 150,
    crop: 'scale',
  });
  // console.log(avatar);

  const { name, email, phone, password } = req.body;

  if (!name || !phone || !password) {
    res.status(401);
    throw new Error('Please fill out all the fields');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    avatar: {
      public_id: myCloud.public_id || 'this is a test',
      // public_id: 'this is a sample',
      url: myCloud.secure_url || 'this is a test',
      // url: 'this is a url',
    },
  });

  sendToken(user, 201, res);
});

// login user

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  // checking if user has given password and email both

  if (!phone || !password) {
    res.status(400).json({
      message: 'Password or phone missing',
    });
  }

  const user = await User.findOne({ phone }).select('+password');

  if (!user) {
    res.status(401).json({
      message: 'User missing',
    });
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    res.status(401);
    throw new Error('password does not match');
  }

  sendToken(user, 200, res);
});

// logout

exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});

// reset password

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // creating token hash
  // creating token hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    // resetPasswordExpires: { $gt: Date.now() * 5 },
  });

  // console.log(user);

  if (!user) {
    res.status(400);
    throw new Error('Reset Password Token is invalid or has been expired');
  }

  if (req.body.password !== req.body.confirmPassword) {
    res.status(400);
    throw new Error('Password does not password');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get user details

exports.getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  // console.log(user);

  res.status(200).json({
    success: true,
    user,
  });
});

// update user password

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  // console.log(user);

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    res.status(401);
    throw new Error('Old password not matched');
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    res.status(400);
    throw new Error('Password does not matched');
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// update user profile

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //  add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get single user (admin)
exports.getSingleUsersAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error(`user does not exists`);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// admin update user role

exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// admin delete user

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});
