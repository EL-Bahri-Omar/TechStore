const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

// Get all products   =>   /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 12; // Products per page
    const productsCount = await Product.countDocuments();

    // Build query with search, filters
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter();

    // Get filtered products count for pagination
    const filteredProductsCount = await apiFeatures.query.clone().countDocuments();
    
    // Apply pagination
    apiFeatures.pagination(resPerPage);
    const products = await apiFeatures.query;

    const currentPage = Number(req.query.page) || 1;
    const totalPages = Math.ceil(filteredProductsCount / resPerPage);

    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products,
        currentPage,
        totalPages
    });
});

// Get single product details   =>   /api/v1/product/:id
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});