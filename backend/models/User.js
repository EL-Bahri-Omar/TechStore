const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
        maxLength: [30, 'First name cannot exceed 30 characters'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
        maxLength: [30, 'Last name cannot exceed 30 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be at least 6 characters long'],
        select: false,
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        }
    },
    address: {
        address: {
            type: String,
            default: '',
            trim: true
        },
        city: {
            type: String,
            default: '',
            trim: true
        },
        postalCode: {
            type: String,
            default: '',
            trim: true
        },
        country: {
            type: String,
            default: '',
            trim: true
        }
    },
    addresses: [{
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true }
    }],
    favorites: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    }],
    refreshTokens: [{
        token: String,
        expiresAt: Date,
        createdAt: { type: Date, default: Date.now }
    }],
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// hash password before saving
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Generate JWT access token
userSchema.methods.getAccessToken = function () {
    return jwt.sign(
        { id: this._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        { id: this._id }, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // Store refresh token in user document
    this.refreshTokens.push({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Keep only last 5 refresh tokens
    if (this.refreshTokens.length > 5) {
        this.refreshTokens = this.refreshTokens.slice(-5);
    }

    return refreshToken;
};

// Verify refresh token
userSchema.methods.verifyRefreshToken = function (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        
        // Check if token exists in user's refresh tokens
        const tokenExists = this.refreshTokens.some(
            refreshToken => refreshToken.token === token && refreshToken.expiresAt > new Date()
        );
        
        return tokenExists && decoded.id === this._id.toString();
    } catch (error) {
        return false;
    }
};

// Remove refresh token (for logout)
userSchema.methods.removeRefreshToken = function (token) {
    this.refreshTokens = this.refreshTokens.filter(
        refreshToken => refreshToken.token !== token
    );
};

module.exports = mongoose.model('User', userSchema);
