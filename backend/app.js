const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.config({ path: 'config/config.env' });

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const favorites = require('./routes/favorites');
const order = require('./routes/order');
const payment = require('./routes/payment');

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', favorites);
app.use('/api/v1', order);
app.use('/api/v1', payment);

// ERROR HANDLING //

// Handle undefined routes
app.all('*', (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found on this server`
    });
});

// Error handling middleware
const errorMiddleware = require('./middlewares/errors');
app.use(errorMiddleware);

module.exports = app;