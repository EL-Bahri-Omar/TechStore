const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler('Email already registered', 409));
    }

    // Create user
    const user = await User.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone ? phone.trim() : ''
    });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});