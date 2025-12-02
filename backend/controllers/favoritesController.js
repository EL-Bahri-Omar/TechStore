const User = require('../models/User');
const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Add/Remove product from favorites => /api/v1/favorites/:productId
exports.toggleFavorite = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    const isFavorite = user.favorites.includes(productId);
    
    if (isFavorite) {
        // Remove from favorites
        user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Product removed from favorites',
            isFavorite: false,
            favorites: user.favorites
        });
    } else {
        // Add to favorites
        user.favorites.push(productId);
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Product added to favorites',
            isFavorite: true,
            favorites: user.favorites
        });
    }
});

// Get user favorites => /api/v1/favorites
exports.getUserFavorites = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('favorites');
    
    res.status(200).json({
        success: true,
        favorites: user.favorites
    });
});

// Check if product is in favorites => /api/v1/favorites/:productId/check
exports.checkFavorite = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;
    
    const isFavorite = user.favorites.includes(productId);
    
    res.status(200).json({
        success: true,
        isFavorite: isFavorite
    });
});