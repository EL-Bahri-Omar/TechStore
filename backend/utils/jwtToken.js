// Send both access and refresh tokens in response
exports.sendTokens = async (user, statusCode, res) => {
    try {
        // Generate tokens
        const accessToken = user.getAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save user to store the refresh token
        await user.save({ validateBeforeSave: false });

        // Cookie options based on environment
        const isProduction = process.env.NODE_ENV === 'PRODUCTION';
        
        const accessTokenCookieOptions = {
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
        };

        const refreshTokenCookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
        };

        // Remove password from output
        user.password = undefined;

        // Send response with cookies
        res.status(statusCode)
            .cookie('accessToken', accessToken, accessTokenCookieOptions)
            .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
            .json({
                success: true,
                accessToken,
                refreshToken,
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
                    createdAt: user.createdAt
                }
            });

    } catch (error) {
        throw new Error('Failed to generate tokens');
    }
};

// Clear authentication cookies (for logout)
exports.clearTokens = (res) => {
    const cookieOptions = {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        sameSite: process.env.NODE_ENV === 'PRODUCTION' ? 'strict' : 'lax',
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
};

// Verify access token
exports.verifyAccessToken = (token) => {
    return require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
};


// Verify refresh token
exports.verifyRefreshToken = (token) => {
    return require('jsonwebtoken').verify(token, process.env.JWT_REFRESH_SECRET);
};