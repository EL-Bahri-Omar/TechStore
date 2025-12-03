import {
    ADD_TO_CART_REQUEST,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAIL,
    REMOVE_FROM_CART_REQUEST,
    REMOVE_FROM_CART_SUCCESS,
    REMOVE_FROM_CART_FAIL,
    UPDATE_CART_ITEM_REQUEST,
    UPDATE_CART_ITEM_SUCCESS,
    UPDATE_CART_ITEM_FAIL,
    CLEAR_CART_REQUEST,
    CLEAR_CART_SUCCESS,
    CLEAR_CART_FAIL,
    SAVE_SHIPPING_INFO,
    SAVE_PAYMENT_INFO,
    CLEAR_ERRORS
} from '../constants/cartConstants';

export const cartReducer = (state = { 
    cartItems: [],
    shippingInfo: {},
    paymentInfo: {}
}, action) => {
    switch (action.type) {
        case ADD_TO_CART_REQUEST:
        case REMOVE_FROM_CART_REQUEST:
        case UPDATE_CART_ITEM_REQUEST:
        case CLEAR_CART_REQUEST:
            return {
                ...state,
                loading: true
            };

        case ADD_TO_CART_SUCCESS:
            const item = action.payload;
            const existItem = state.cartItems.find(x => x.id === item.id);

            if (existItem) {
                return {
                    ...state,
                    loading: false,
                    cartItems: state.cartItems.map(x =>
                        x.id === existItem.id ? item : x
                    )
                };
            } else {
                return {
                    ...state,
                    loading: false,
                    cartItems: [...state.cartItems, item]
                };
            }

        case REMOVE_FROM_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: state.cartItems.filter(x => x.id !== action.payload)
            };

        case UPDATE_CART_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: state.cartItems.map(x =>
                    x.id === action.payload.productId 
                        ? { ...x, quantity: action.payload.quantity } 
                        : x
                )
            };

        case CLEAR_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: []
            };

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            };

        case SAVE_PAYMENT_INFO:
            return {
                ...state,
                paymentInfo: action.payload
            };

        case ADD_TO_CART_FAIL:
        case REMOVE_FROM_CART_FAIL:
        case UPDATE_CART_ITEM_FAIL:
        case CLEAR_CART_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};