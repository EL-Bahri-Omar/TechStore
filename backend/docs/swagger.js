const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechStore API Documentation',
      version: '1.0.0',
      description: `Complete e-commerce API with authentication, products, orders, payments, and favorites.`
    },
    servers: [
      {
        url: 'http://localhost:4000/api/v1'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'JWT access token stored in HTTP-only cookie'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token in Authorization header (alternative to cookies)'
        }
      },
      schemas: {
        // USER SCHEMA
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: {
              type: 'string',
              example: 'John',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              example: 'Doe',
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'Password123!',
              description: 'User password (min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)'
            },
            phone: {
              type: 'string',
              example: '+1234567890',
              description: 'User phone number'
            }
          }
        },
        // PRODUCT SCHEMA
        Product: {
          type: 'object',
          required: ['name', 'price', 'description', 'category', 'stock'],
          properties: {
            name: {
              type: 'string',
              example: 'MacBook Pro 14"',
              description: 'Product name'
            },
            price: {
              type: 'number',
              format: 'float',
              example: 2199.99,
              description: 'Product price in EUR'
            },
            description: {
              type: 'string',
              example: 'Apple MacBook Pro 14-inch with M3 Pro chip',
              description: 'Product description'
            },
            category: {
              type: 'string',
              enum: ['Téléphonie & Tablette', 'Informatique', 'Stockage', 'Impression', 'Audio', 'Accessoires', 'Photo', 'Télévision'],
              example: 'Informatique',
              description: 'Product category'
            },
            stock: {
              type: 'integer',
              example: 25,
              description: 'Available stock quantity'
            },
            rating: {
              type: 'number',
              example: 4.5,
              description: 'Product rating (0-5)'
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  public_id: { type: 'string' },
                  url: { type: 'string', format: 'uri' }
                }
              }
            },
            features: {
              type: 'array',
              items: { type: 'string' },
              example: ['M3 Pro chip', '16GB RAM', '512GB SSD'],
              description: 'Product features'
            },
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { type: 'string' },
                  rating: { type: 'number', minimum: 0, maximum: 5 },
                  comment: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        // ORDER SCHEMAS
        OrderItem: {
          type: 'object',
          required: ['id', 'name', 'quantity', 'price'],
          properties: {
            id: { type: 'string', description: 'Product ID' },
            name: { type: 'string' },
            quantity: { type: 'integer', minimum: 1, example: 2 },
            price: { type: 'number', example: 299.99 },
            image: { type: 'string', format: 'uri' },
            category: { type: 'string' },
            description: { type: 'string' }
          }
        },
        ShippingInfo: {
          type: 'object',
          required: ['firstName', 'lastName', 'address', 'city', 'postalCode', 'country'],
          properties: {
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            address: { type: 'string', example: '123 Main Street' },
            city: { type: 'string', example: 'Paris' },
            postalCode: { type: 'string', example: '75001' },
            country: { type: 'string', example: 'France' },
            phone: { type: 'string', example: '+1234567890' },
            email: { type: 'string', format: 'email', example: 'john@example.com' }
          }
        },
        ShippingMethod: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'standard' },
            name: { type: 'string', example: 'Livraison Standard' },
            price: { type: 'number', example: 4.99 },
            duration: { type: 'string', example: '3-5 jours' }
          }
        },
        Order: {
          type: 'object',
          required: ['orderItems', 'shippingInfo', 'paymentMethod'],
          properties: {
            orderItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' }
            },
            shippingInfo: { $ref: '#/components/schemas/ShippingInfo' },
            paymentMethod: {
              type: 'string',
              enum: ['card', 'paypal'],
              example: 'card',
              description: 'Payment method'
            },
            shippingMethod: { $ref: '#/components/schemas/ShippingMethod' },
            itemsPrice: { type: 'number', example: 599.98 },
            shippingPrice: { type: 'number', example: 4.99 },
            totalPrice: { type: 'number', example: 604.97 }
          }
        }
      }
    },
    security: [
      {
        cookieAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User registration, login, and token management'
      },
      {
        name: 'Products',
        description: 'Product catalog and details'
      },
      {
        name: 'Favorites',
        description: 'User favorites management'
      },
      {
        name: 'Orders',
        description: 'Order creation and management'
      },
      {
        name: 'Payments',
        description: 'Payment processing with Stripe'
      }
    ]
  },
  apis: [
    path.join(__dirname, '../docs/*.js')
  ]
};

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns authentication tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Sets accessToken and refreshToken as HTTP-only cookies
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user
 *     description: Login with email and password, returns authentication tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Sets accessToken and refreshToken as HTTP-only cookies
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: 'Invalid email or password'
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidates refresh token and clears authentication cookies
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token to invalidate
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: true
 *               message: 'Logged out successfully'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Clears accessToken and refreshToken cookies
 *       400:
 *         description: Refresh token required
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns profile information of the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /me/update:
 *   put:
 *     summary: Update user profile
 *     description: Update profile information of the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jonathan
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jonathan@example.com
 *               phone:
 *                 type: string
 *                 example: '+9876543210'
 *               address:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: '456 Oak Avenue'
 *                   city:
 *                     type: string
 *                     example: 'Paris'
 *                   postalCode:
 *                     type: string
 *                     example: '75001'
 *                   country:
 *                     type: string
 *                     example: 'France'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

// ============================================================================
// PRODUCTS ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Returns paginated list of products with filtering and sorting options
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search products by name
 *         example: laptop
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Téléphonie & Tablette, Informatique, Stockage, Impression, Audio, Accessoires, Photo, Télévision]
 *         description: Filter by category
 *         example: Informatique
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: price[gte]
 *         schema:
 *           type: number
 *           minimum: 0
 *           default: 0
 *         description: Minimum price
 *         example: 500
 *       - in: query
 *         name: price[lte]
 *         schema:
 *           type: number
 *           maximum: 2000
 *           default: 2000
 *         description: Maximum price
 *         example: 2000
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, -createdAt, -rating]
 *           default: -createdAt
 *         description: Sort field (- for descending)
 *         example: -price
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get single product details
 *     description: Returns detailed information about a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: 6924db2c3bda31ac334785de
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

// ============================================================================
// FAVORITES ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /favorites/{productId}:
 *   post:
 *     summary: Add/remove product from favorites
 *     description: Toggle product in user's favorites list
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to toggle in favorites
 *         example: 6924db2c3bda31ac334785de
 *     responses:
 *       200:
 *         description: Favorite status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get user's favorite products
 *     description: Returns list of products marked as favorite by the user
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoritesResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

// ============================================================================
// ORDERS ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /order/new:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with shipping and payment information
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /orders/me:
 *   get:
 *     summary: Get user's orders
 *     description: Returns list of all orders placed by the authenticated user
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

// ============================================================================
// PAYMENTS ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /payment/process:
 *   post:
 *     summary: Process payment
 *     description: Process payment using Stripe payment gateway
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Payment processing failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: 'Votre carte a été refusée.'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /stripeapi:
 *   get:
 *     summary: Get Stripe API key
 *     description: Returns Stripe publishable API key for client-side integration
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stripe key retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StripeKeyResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

const specs = swaggerJsdoc(swaggerOptions);
module.exports = specs;
