const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const specs = require('./docs/swagger');

// Swagger UI setup
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "TechStore API Documentation"
}));

// Redirect root API to docs
app.get('/api/v1', (req, res) => {
  res.redirect('/api/v1/docs');
});

// Import security middleware
const { apiLimiter, corsOptions } = require('./middlewares/security');

dotenv.config({ path: 'config/config.env' });

// CORS
app.use(cors(corsOptions));

// Rate limiting
app.use('/api/v1', apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ROUTES
const products = require('./routes/product');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');
const favorites = require('./routes/favorites');

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', payment);
app.use('/api/v1', order);
app.use('/api/v1', favorites);

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
