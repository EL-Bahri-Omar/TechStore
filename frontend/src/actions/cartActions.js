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

// Add item to cart
export const addToCart = (product, quantity = 1) => async (dispatch, getState) => {
    try {
        dispatch({ type: ADD_TO_CART_REQUEST });

        const cartItem = {
            id: product.id || product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url || product.image || '/images/default-product.jpg',
            quantity: quantity,
            stock: product.stock,
            category: product.category
        };

        dispatch({
            type: ADD_TO_CART_SUCCESS,
            payload: cartItem
        });

        // Save to sessionStorage
        const { cartItems } = getState().cart;
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

    } catch (error) {
        dispatch({
            type: ADD_TO_CART_FAIL,
            payload: error.response?.data?.message || 'Erreur lors de l\'ajout au panier'
        });
    }
};

// Remove item from cart
export const removeFromCart = (productId) => async (dispatch, getState) => {
    try {
        dispatch({ type: REMOVE_FROM_CART_REQUEST });

        dispatch({
            type: REMOVE_FROM_CART_SUCCESS,
            payload: productId
        });

        // Update sessionStorage
        const { cartItems } = getState().cart;
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

    } catch (error) {
        dispatch({
            type: REMOVE_FROM_CART_FAIL,
            payload: error.response?.data?.message || 'Erreur lors de la suppression'
        });
    }
};

// Update cart item quantity
export const updateCartItem = (productId, quantity) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_CART_ITEM_REQUEST });

        if (quantity < 1) {
            // If quantity is 0 or less, remove the item
            dispatch(removeFromCart(productId));
            return;
        }

        dispatch({
            type: UPDATE_CART_ITEM_SUCCESS,
            payload: { productId, quantity }
        });

        // Update sessionStorage
        const { cartItems } = getState().cart;
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

    } catch (error) {
        dispatch({
            type: UPDATE_CART_ITEM_FAIL,
            payload: error.response?.data?.message || 'Erreur lors de la mise à jour'
        });
    }
};

// Clear entire cart
export const clearCart = () => async (dispatch) => {
    try {
        dispatch({ type: CLEAR_CART_REQUEST });

        dispatch({
            type: CLEAR_CART_SUCCESS
        });

        // Clear from sessionStorage
        sessionStorage.removeItem('cartItems');

    } catch (error) {
        dispatch({
            type: CLEAR_CART_FAIL,
            payload: error.response?.data?.message || 'Erreur lors de la suppression du panier'
        });
    }
};

// Save shipping information
export const saveShippingInfo = (data) => async (dispatch) => {
    try {
        dispatch({
            type: SAVE_SHIPPING_INFO,
            payload: data
        });

        // Save to sessionStorage for persistence
        sessionStorage.setItem('shippingInfo', JSON.stringify(data));
        
    } catch (error) {
        console.error('Error saving shipping info:', error);
    }
};

// Save payment information
export const savePaymentInfo = (paymentInfo) => async (dispatch) => {
    dispatch({
        type: SAVE_PAYMENT_INFO,
        payload: paymentInfo
    });
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};