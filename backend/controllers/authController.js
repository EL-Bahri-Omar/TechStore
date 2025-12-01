const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { sendTokens, clearTokens, verifyRefreshToken } = require('../utils/jwtToken');

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

    // Send tokens
    await sendTokens(user, 201, res);
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

    // Send tokens
    await sendTokens(user, 200, res);
});

exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new ErrorHandler('Refresh token is required', 400));
    }

    try {
        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        
        // Find user by ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorHandler('User not found', 401));
        }

        // Verify refresh token belongs to user
        if (!user.verifyRefreshToken(refreshToken)) {
            return next(new ErrorHandler('Invalid refresh token', 401));
        }

        // Generate new access token
        const accessToken = user.getAccessToken();

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {
        return next(new ErrorHandler('Invalid or expired refresh token', 401));
    }
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new ErrorHandler('Refresh token is required', 400));
    }

    try {
        // Verify and decode refresh token to get user ID
        const decoded = verifyRefreshToken(refreshToken);
        
        // Find user and remove the refresh token
        const user = await User.findById(decoded.id);
        if (user) {
            user.removeRefreshToken(refreshToken);
            await user.save({ validateBeforeSave: false });
        }

        // Clear cookies
        clearTokens(res);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        // Even if token is invalid, clear cookies
        clearTokens(res);
        return next(new ErrorHandler('Logout completed', 200));
    }
});

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            addresses: user.addresses,
            favorites: user.favorites,
            orders: user.orders,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        }
    });
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
    };

    // Update address if provided
    if (req.body.address) {
        newUserData.address = {
            address: req.body.address.address || '',
            city: req.body.address.city || '',
            postalCode: req.body.address.postalCode || '',
            country: req.body.address.country || ''
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            addresses: user.addresses,
            favorites: user.favorites,
            orders: user.orders,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        }
    });
});