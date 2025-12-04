import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { 
    Elements,
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from '@stripe/react-stripe-js';
import { ChevronLeft, Shield, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { AlertMessages } from '../../utils/alertMessages';
import { createOrder } from '../../actions/orderActions';
import { clearCart } from '../../actions/cartActions';
import { success, error } from '../../actions/alertActions';
import { processPayment, getStripeKey, clearPaymentErrors } from '../../actions/paymentActions';

let stripePromise = null;

// Stripe Card Form Component
const StripePaymentForm = ({ 
    total,
    orderData,
    onPaymentSuccess,
    isProcessing,
    setIsProcessing 
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements) {
            dispatch(error('Système de paiement non disponible'));
            return;
        }

        setIsProcessing(true);
        dispatch(clearPaymentErrors());

        try {
            // Create payment method
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardNumberElement),
            });

            if (stripeError) {
                dispatch(error(stripeError.message));
                setIsProcessing(false);
                return;
            }

            console.log('✅ Card validated by Stripe:', paymentMethod.id);

            // Process payment through Redux action
            const paymentResult = await dispatch(processPayment(paymentMethod.id, total));

            if (paymentResult.success) {
                console.log('✅ Payment processed successfully');
                
                // Create order with payment info
                const orderWithPayment = {
                    ...orderData,
                    paymentInfo: {
                        id: paymentResult.data.payment_intent_id,
                        status: 'paid'
                    }
                };

                const orderResult = await dispatch(createOrder(orderWithPayment));

                if (orderResult.success) {
                    onPaymentSuccess({
                        orderId: orderResult.order._id
                    });
                } else {
                    dispatch(error(orderResult.error));
                    setIsProcessing(false);
                }
            } else {
                dispatch(error(paymentResult.error || 'Erreur de traitement du paiement'));
                setIsProcessing(false);
            }

        } catch (err) {
            console.error('Payment processing error:', err);
            dispatch.error(err.message || AlertMessages.PAYMENT_ERROR);
            setIsProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
            },
            invalid: {
                color: '#9e2146',
                iconColor: '#9e2146',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <div className="payment-form-fields">
                <div className="form-group-enhanced">
                    <label>Numéro de carte *</label>
                    <div className="stripe-element-container">
                        <CardNumberElement options={cardElementOptions} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group-enhanced">
                        <label>Date d'expiration *</label>
                        <div className="stripe-element-container">
                            <CardExpiryElement options={cardElementOptions} />
                        </div>
                    </div>

                    <div className="form-group-enhanced">
                        <label>Code de sécurité (CVC) *</label>
                        <div className="stripe-element-container">
                            <CardCvcElement options={cardElementOptions} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="security-notice-card">
                <div className="security-content">
                    <div className="security-icon">
                        <Shield size={24} />
                    </div>
                    <div>
                        <div className="security-title">
                            Paiement 100% sécurisé par Stripe
                        </div>
                        <div className="security-description">
                            Vos données bancaires sont cryptées et protégées par Stripe. 
                            Aucune information de carte n'est stockée sur nos serveurs.
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="btn-primary-xl payment-submit-btn"
            >
                {isProcessing ? (
                    <>
                        <div className="loader-spinner"></div>
                        Traitement en cours...
                    </>
                ) : (
                    <>
                        Payer {total.toFixed(2)} €
                        <Lock size={20} />
                    </>
                )}
            </button>
        </form>
    );
};

// Main Payment Page Component
const PaymentPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { loading: orderLoading } = useSelector(state => state.newOrder);
    const { stripeApiKey, loading: paymentLoading } = useSelector(state => state.payment);
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [stripeLoaded, setStripeLoaded] = useState(false);

    // Calculate order totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = shippingInfo?.shippingPrice || 4.99;
    const tax = subtotal * 0.2;
    const total = subtotal + shippingCost + tax;

    // Get shipping method name
    const getShippingMethodName = () => {
        if (!shippingInfo?.shippingMethod) return 'Livraison Standard';
        const methods = {
            'standard': 'Livraison Standard',
            'express': 'Livraison Express', 
            'priority': 'Livraison Prioritaire'
        };
        return methods[shippingInfo.shippingMethod] || 'Livraison Standard';
    };

    // Prepare order data
    const orderData = {
        orderItems: cartItems.map(item => ({
            id: item.id || item._id,
            name: item.name,
            quantity: Number(item.quantity),
            price: Number(item.price),
            image: item.image
        })),
        shippingInfo: {
            firstName: shippingInfo.firstName || '',
            lastName: shippingInfo.lastName || '',
            address: shippingInfo.address || '',
            city: shippingInfo.city || '',
            postalCode: shippingInfo.postalCode || '',
            country: shippingInfo.country || '',
            phone: shippingInfo.phone || ''
        },
        paymentMethod: 'card',
        shippingMethod: shippingInfo.shippingMethod || 'standard',
        itemsPrice: Number(subtotal.toFixed(2)),
        shippingPrice: Number(shippingCost.toFixed(2)),
        taxPrice: Number(tax.toFixed(2)),
        totalPrice: Number(total.toFixed(2))
    };

    // Initialize Stripe using Redux action
    useEffect(() => {
        const initializeStripe = async () => {
            if (!stripeApiKey) {
                // Get Stripe key through Redux action
                const result = await dispatch(getStripeKey());
                
                if (result.success && result.stripeApiKey) {
                    stripePromise = loadStripe(result.stripeApiKey);
                    setStripeLoaded(true);
                    console.log('✅ Stripe loaded successfully');
                } else {
                    console.error('❌ Failed to get Stripe key:', result.error);
                    dispatch(error('Erreur de chargement du système de paiement'));
                }
            } else if (stripeApiKey && !stripeLoaded) {
                // Stripe key already exists in Redux state
                stripePromise = loadStripe(stripeApiKey);
                setStripeLoaded(true);
            }
        };

        initializeStripe();
    }, [dispatch, stripeApiKey, stripeLoaded]);

    const handlePaymentSuccess = (paymentResult) => {
        dispatch(success(AlertMessages.PAYMENT_SUCCESS));
        setIsSuccess(true);
        dispatch(clearCart());
        
        setTimeout(() => {
            navigate('/confirmation', { 
                state: { 
                    orderId: paymentResult.orderId,
                    orderTotal: total 
                } 
            });
        }, 2000);
    };

    // Success state
    if (isSuccess) {
        return (
            <div className="payment-success">
                <div className="payment-success-content">
                    <div className="success-icon">
                        <CheckCircle size={48} />
                    </div>
                    <h1>Paiement réussi !</h1>
                    <p>Redirection vers la confirmation...</p>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    // Error states
    if (cartItems.length === 0) {
        return (
            <div className="payment-empty">
                <div className="payment-empty-content">
                    <div className="payment-empty-icon">
                        <CreditCard size={48} />
                    </div>
                    <h1>Panier vide</h1>
                    <p>Votre panier est vide, impossible de procéder au paiement.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn-primary-lg"
                    >
                        Découvrir les produits
                    </button>
                </div>
            </div>
        );
    }

    if (!shippingInfo) {
        return (
            <div className="payment-empty">
                <div className="payment-empty-content">
                    <div className="payment-empty-icon">
                        <Shield size={48} />
                    </div>
                    <h1>Informations manquantes</h1>
                    <p>Veuillez compléter vos informations de livraison avant de payer.</p>
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="btn-primary-lg"
                    >
                        Retour à la livraison
                    </button>
                </div>
            </div>
        );
    }

    // Show loading while initializing Stripe
    if (paymentLoading || (!stripeLoaded && !stripeApiKey)) {
        return (
            <div className="payment-page">
                <div className="payment-container">
                    <div className="loading-stripe">
                        <div className="loader-spinner"></div>
                        <p>Chargement du système de paiement...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <button
                        onClick={() => navigate('/checkout')}
                        className="back-button"
                    >
                        <ChevronLeft size={20} />
                        <span>Retour au checkout</span>
                    </button>
                    
                    <div className="payment-steps">
                        <h1>Paiement sécurisé</h1>
                        <div className="progress-steps">
                            {['Panier', 'Livraison', 'Paiement', 'Confirmation'].map((step, index) => (
                                <div key={`payment-step-${index}`} className="progress-step-container">
                                    <div className={`progress-step ${
                                        index <= 1 ? 'progress-step-completed' : 
                                        index === 2 ? 'progress-step-active' : 'progress-step-upcoming'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <span className={`step-label ${index <= 2 ? 'step-active' : 'step-inactive'}`}>
                                        {step}
                                    </span>
                                    {index < 3 && (
                                        <div className={`step-connector ${index < 2 ? 'connector-active' : 'connector-inactive'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="payment-content">
                    <div className="payment-form-section">
                        <div className="payment-form-card">
                            <div className="payment-form-header">
                                <div className="payment-form-icon">
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <h2>Paiement sécurisé par Stripe</h2>
                                    <p>Saisissez les détails de votre carte</p>
                                </div>
                            </div>

                            {stripeLoaded && stripePromise ? (
                                <Elements stripe={stripePromise}>
                                    <StripePaymentForm
                                        total={total}
                                        orderData={orderData}
                                        onPaymentSuccess={handlePaymentSuccess}
                                        isProcessing={isProcessing || orderLoading}
                                        setIsProcessing={setIsProcessing}
                                    />
                                </Elements>
                            ) : (
                                <div className="loading-stripe">
                                    <div className="loader-spinner"></div>
                                    <p>Chargement du système de paiement...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="payment-summary">
                        <div className="summary-card">
                            <h2>Votre commande</h2>
                            
                            <div className="summary-content">
                                <div className="summary-section">
                                    <h3><CreditCard size={18} />Livraison</h3>
                                    <div className="shipping-address">
                                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                                        <p>{shippingInfo.address}<br />{shippingInfo.postalCode} {shippingInfo.city}</p>
                                        <p>{shippingInfo.country}</p>
                                        {shippingInfo.phone && <p>Tél: {shippingInfo.phone}</p>}
                                        <p><strong>Mode de livraison:</strong> {getShippingMethodName()}</p>
                                    </div>
                                </div>

                                <div className="summary-section">
                                    <h3>Articles</h3>
                                    <div className="order-items-summary">
                                        {cartItems.map((item) => (
                                            <div key={`payment-item-${item.id}`} className="order-item-summary">
                                                <div>
                                                    <span>{item.name}</span>
                                                    <span>x{item.quantity}</span>
                                                </div>
                                                <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="summary-totals">
                                    <div className="total-row"><span>Sous-total</span><span>{subtotal.toFixed(2)} €</span></div>
                                    <div className="total-row"><span>Livraison</span><span>{shippingCost.toFixed(2)} €</span></div>
                                    <div className="total-row"><span>TVA (20%)</span><span>{tax.toFixed(2)} €</span></div>
                                    <div className="grand-total"><span>Total</span><span>{total.toFixed(2)} €</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;