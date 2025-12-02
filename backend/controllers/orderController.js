const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create a new order => api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => { 
    const {
        orderItems,
        shippingInfo,
        paymentMethod,
        shippingMethod,
        itemsPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        paymentMethod,
        shippingMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    // Update product stock
    orderItems.forEach(async item => {
        await updateStock(item.id, item.quantity);
    });

    // Push order to user's orders array
    await User.findByIdAndUpdate(
        req.user._id,
        { $push: { orders: order._id } }
    );

    // Add shipping address to user's addresses array if not already exists
    const user = await User.findById(req.user._id);
    const addressData = {
        address: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country
    };

    const isAddressExists = (addresses, newAddress) => {
        return addresses.some(existingAddress => 
            existingAddress.address === newAddress.address &&
            existingAddress.city === newAddress.city &&
            existingAddress.postalCode === newAddress.postalCode &&
            existingAddress.country === newAddress.country
        );
    };
    
    if (!isAddressExists(user.addresses, addressData)) {
        await User.findByIdAndUpdate(
            req.user._id,
            { 
                $push: { 
                    addresses: addressData
                } 
            }
        );
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email')

    if (!order) {
        return next(new ErrorHandler('No order found with this ID', 404))
    }

    // Check if order belongs to user
    if (order.user._id.toString() !== req.user.id.toString()) {
        return next(new ErrorHandler('You are not authorized to view this order', 403))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in user orders => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('orders');
    
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        orders: user.orders || []
    });
});

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (product) {
        product.stock = product.stock - quantity;
        await product.save({ validateBeforeSave: false });
    }
}