import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstants';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

// Get all products
export const getProducts = (keyword = '', category = '', currentPage = 1, priceRange = [0, 2000], sortBy = 'popularity') => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCTS_REQUEST });

        let url = `/products?`;
        const params = new URLSearchParams();
        
        // Add search parameters
        if (keyword) params.append('keyword', keyword);
        if (category && category !== 'all') params.append('category', category);
        if (currentPage > 1) params.append('page', currentPage);
        
        // Add price range
        params.append('price[gte]', priceRange[0]);
        params.append('price[lte]', priceRange[1]);
        
        // Add sorting
        let sortParam = '';
        switch(sortBy) {
            case 'price-asc':
                sortParam = 'price';
                break;
            case 'price-desc':
                sortParam = '-price';
                break;
            case 'rating':
                sortParam = '-rating';
                break;
            default:
                sortParam = '-createdAt'; // Default: newest first
        }
        params.append('sort', sortParam);

        url += params.toString();

        console.log('Fetching products from:', url);

        const { data } = await axios.get(url);

        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response?.data?.message || 'Erreur lors du chargement des produits'
        });
    }
};

// Get product details
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(`/product/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        });

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response?.data?.message || 'Erreur lors du chargement du produit'
        });
    }
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};

