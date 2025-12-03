import {
    PROCESS_PAYMENT_REQUEST,
    PROCESS_PAYMENT_SUCCESS,
    PROCESS_PAYMENT_FAIL,
    GET_STRIPE_KEY_REQUEST,
    GET_STRIPE_KEY_SUCCESS,
    GET_STRIPE_KEY_FAIL,
    GET_ORDER_TOTAL_REQUEST,
    GET_ORDER_TOTAL_SUCCESS,
    GET_ORDER_TOTAL_FAIL,
    CLEAR_PAYMENT_ERRORS,
    RESET_PAYMENT_STATE
} from '../constants/paymentConstants';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

export const processPayment = (paymentMethodId, amount) => async (dispatch) => {
    try {
        dispatch({ type: PROCESS_PAYMENT_REQUEST });

        console.log('💰 Sending payment request:', {
            amount,
            paymentMethodId: paymentMethodId.substring(0, 20) + '...'
        });

        const { data } = await axios.post(
            `/payment/process`,
            { 
                amount: Number(amount), 
                paymentMethodId: paymentMethodId 
            },
            { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Payment response:', data);

        dispatch({
            type: PROCESS_PAYMENT_SUCCESS,
            payload: data
        });

        return { success: true, data };

    } catch (error) {
        console.error('❌ Payment error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        const errorMessage = error.response?.data?.message || 'Erreur lors du traitement du paiement';
        
        dispatch({
            type: PROCESS_PAYMENT_FAIL,
            payload: errorMessage
        });

        return { success: false, error: errorMessage };
    }
};

export const getOrderTotal = () => async (dispatch, getState) => {
    try {
        dispatch({ type: GET_ORDER_TOTAL_REQUEST });

        const { cart } = getState();
        const { cartItems, shippingInfo } = cart;

        if (!cartItems || cartItems.length === 0) {
            throw new Error('Panier vide');
        }

        const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shippingCost = shippingInfo?.shippingPrice || 4.99;
        const tax = subtotal * 0.2;
        const total = subtotal + shippingCost + tax;

        dispatch({
            type: GET_ORDER_TOTAL_SUCCESS,
            payload: total
        });

        return { success: true, total };

    } catch (error) {
        const errorMessage = error.message || 'Erreur lors du calcul du total';
        
        dispatch({
            type: GET_ORDER_TOTAL_FAIL,
            payload: errorMessage
        });

        return { success: false, error: errorMessage };
    }
};

// Get Stripe API key
export const getStripeKey = () => async (dispatch) => {
    try {
        dispatch({ type: GET_STRIPE_KEY_REQUEST });

        const { data } = await axios.get(`/stripeapi`, {
            withCredentials: true
        });

        dispatch({
            type: GET_STRIPE_KEY_SUCCESS,
            payload: data.stripeApiKey
        });

        return { success: true, stripeApiKey: data.stripeApiKey };

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur de chargement du système de paiement';
        
        dispatch({
            type: GET_STRIPE_KEY_FAIL,
            payload: errorMessage
        });

        return { success: false, error: errorMessage };
    }
};

export const clearPaymentErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_PAYMENT_ERRORS });
};

export const resetPaymentState = () => async (dispatch) => {
    dispatch({ type: RESET_PAYMENT_STATE });
};