import {
    PROCESS_PAYMENT_REQUEST,
    PROCESS_PAYMENT_SUCCESS,
    PROCESS_PAYMENT_FAIL,
    GET_ORDER_TOTAL_REQUEST,
    GET_ORDER_TOTAL_SUCCESS,
    GET_ORDER_TOTAL_FAIL,
    GET_STRIPE_KEY_REQUEST,
    GET_STRIPE_KEY_SUCCESS,
    GET_STRIPE_KEY_FAIL,
    CLEAR_PAYMENT_ERRORS,
    RESET_PAYMENT_STATE
} from '../constants/paymentConstants';

export const paymentReducer = (state = {
    loading: false,
    orderTotal: 0,
    stripeApiKey: '',
    paymentResult: null,
    error: null
}, action) => {
    switch (action.type) {
        case PROCESS_PAYMENT_REQUEST:
        case GET_ORDER_TOTAL_REQUEST:
        case GET_STRIPE_KEY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case PROCESS_PAYMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                paymentResult: action.payload,
                error: null
            };

        case GET_ORDER_TOTAL_SUCCESS:
            return {
                ...state,
                loading: false,
                orderTotal: action.payload,
                error: null
            };

        case GET_STRIPE_KEY_SUCCESS:
            return {
                ...state,
                loading: false,
                stripeApiKey: action.payload,
                error: null
            };

        case PROCESS_PAYMENT_FAIL:
        case GET_ORDER_TOTAL_FAIL:
        case GET_STRIPE_KEY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_PAYMENT_ERRORS:
            return {
                ...state,
                error: null
            };

        case RESET_PAYMENT_STATE:
            return {
                loading: false,
                orderTotal: 0,
                stripeApiKey: '',
                paymentResult: null,
                error: null
            };

        default:
            return state;
    }
};