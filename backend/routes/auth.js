const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
    logout
} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

module.exports = router;