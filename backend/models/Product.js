const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
        enum: {
            values: [
                'Téléphonie & Tablette',
                'Informatique',
                'Stockage',
                'Impression',
                'Audio',
                'Accessoires',
                'Photo',
                'Télévision'
            ],
            message: 'Please select correct category for product'
        }
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    ],
    features: [String],
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        default: 0
    },
    reviews: [
        {
            user: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);