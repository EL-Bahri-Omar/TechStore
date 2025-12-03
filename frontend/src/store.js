import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Import reducers
import { alertReducer } from './reducers/alertReducers';
import { authReducer, userReducer } from './reducers/userReducers';
import { favoritesReducer } from './reducers/favoritesReducer';
import { cartReducer } from './reducers/cartReducers';
import { paymentReducer } from './reducers/paymentReducers';
import { 
    newOrderReducer, 
    myOrdersReducer, 
    orderDetailsReducer 
} from './reducers/orderReducers';
import { 
    productsReducer, 
    productDetailsReducer, 
    newReviewReducer,
    productReviewsReducer 
} from './reducers/productReducers';

const reducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    payment: paymentReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    products: productsReducer,
    productDetails: productDetailsReducer,
    newReview: newReviewReducer,
    productReviews: productReviewsReducer,
    favorites: favoritesReducer,
    alert: alertReducer 
});

// Get initial state
const cartItemsFromStorage = sessionStorage.getItem('cartItems') 
    ? JSON.parse(sessionStorage.getItem('cartItems'))
    : [];

const shippingInfoFromStorage = sessionStorage.getItem('shippingInfo')
    ? JSON.parse(sessionStorage.getItem('shippingInfo'))
    : {};

const initialState = {
    auth: {
        user: null,
        loading: true,
        isAuthenticated: false,
        error: null
    },
    cart: {
        cartItems: cartItemsFromStorage,
        shippingInfo: shippingInfoFromStorage,
        paymentInfo: {}
    },
    alert: {
        alerts: [] 
    }
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;