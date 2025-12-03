import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_RESET,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_RESET,
    CLEAR_ERRORS
} from '../constants/orderConstants';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

// Create new order 
export const createOrder = (orderData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_ORDER_REQUEST });

        console.log('🔄 Creating order with data:', JSON.stringify(orderData, null, 2));

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        };

        const { data } = await axios.post(`/order/new`, orderData, config);

        console.log('✅ Order created successfully:', data);

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        });

        return { 
            success: true, 
            order: data.order 
        };

    } catch (error) {
        console.error('❌ Order creation failed:');
        console.error('Status:', error.response?.status);
        console.error('Error Data:', error.response?.data);
        console.error('Error Message:', error.response?.data?.message);
        console.error('Validation Errors:', error.response?.data?.errors);
        console.error('Full Error:', error);

        const errorMessage = error.response?.data?.message || 'Erreur lors de la création de la commande';
        
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: errorMessage
        });

        return { 
            success: false, 
            error: errorMessage 
        };
    }
};

// Get my orders
export const myOrders = () => async (dispatch) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST });

        const { data } = await axios.get(`/orders/me`, { 
            withCredentials: true 
        });

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.orders
        });

    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response?.data?.message || 'Erreur lors du chargement des commandes'
        });
    }
};

// Get order details
export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const { data } = await axios.get(`/order/${id}`, { 
            withCredentials: true 
        });

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.order
        });

    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response?.data?.message || 'Erreur lors du chargement des détails de la commande'
        });
    }
};

// Clear order state
export const clearOrder = () => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_RESET });
};

// Clear order details
export const clearOrderDetails = () => async (dispatch) => {
    dispatch({ type: ORDER_DETAILS_RESET });
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};