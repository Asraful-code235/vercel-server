const express = require('express');
const {
  registerUser,
  loginUser,
  logOut,

  getUserDetails,

  updateUserProfile,
  getAllUsers,
  getSingleUsersAdmin,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

const router = express.Router();

// routes

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logOut);

router.route('/user/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/update').put(isAuthenticatedUser, updateUserProfile);

router.route('/admin/users').get(isAuthenticatedUser, getAllUsers);
router.route('/admin/users/:id').get(isAuthenticatedUser, getSingleUsersAdmin);
router.route('/admin/users/:id').put(isAuthenticatedUser, updateUserRole);
router.route('/admin/users/:id').delete(isAuthenticatedUser, deleteUser);

module.exports = router;
