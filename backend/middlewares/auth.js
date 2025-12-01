const User = require('../models/User');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('./catchAsyncErrors');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    let token;

    // Check for token in cookies first, then Authorization header
    if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorHandler('Access denied. Please login to access this resource.', 401));
    }

    try {
        // Verify access token
        const decoded = verifyAccessToken(token);
        
        // Find user and attach to request
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return next(new ErrorHandler('User not found. Please login again.', 401));
        }
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorHandler('Your access token has expired. Please refresh your token.', 401));
        }
        return next(new ErrorHandler('Invalid authentication token.', 401));
    }
});

// Doesn't throw error if no user, just continues without user data
exports.optionalAuth = catchAsyncErrors(async (req, res, next) => {
    let token;

    if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = verifyAccessToken(token);
            req.user = await User.findById(decoded.id);
        } catch (error) {
            // Ignore token errors for optional auth
        }
    }
    
    next();
});