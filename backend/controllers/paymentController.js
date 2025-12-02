const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Order = require('../models/Order');

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    try {
        const { amount, paymentMethodId } = req.body;

        if (!amount || !paymentMethodId) {
            return next(new ErrorHandler('Amount and payment method are required', 400));
        }

        // Convert to cents
        const amountInCents = Math.round(amount * 100);

        // Create and confirm payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'eur',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            metadata: {
                user_id: req.user.id
            }
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id,
            message: 'Paiement traité avec succès'
        });

    } catch (error) {
        
        let errorMessage = 'Erreur lors du traitement du paiement';
        if (error.type === 'StripeCardError') {
            errorMessage = error.message;
        }

        return next(new ErrorHandler(errorMessage, 400));
    }
});

exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success: true,
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});