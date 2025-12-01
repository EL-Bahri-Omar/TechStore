const Product = require('../models/Product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const path = require('path'); 

dotenv.config({ path: '../config/config.env' });

connectDatabase();

const products = require('../data/products'); 

const seedProducts = async () => {
    try {
        console.log('Deleting existing products...');
        await Product.deleteMany();
        console.log('✅ All Products are deleted.');

        console.log('Adding new products...');
        await Product.insertMany(products);
        console.log(`✅ ${products.length} Products added successfully!`);

        process.exit(0);

    } catch (error) {
        console.log('❌ Error:', error.message);
        process.exit(1);
    }
}

seedProducts();