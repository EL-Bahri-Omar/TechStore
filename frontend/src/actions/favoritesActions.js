import {
    TOGGLE_FAVORITE_REQUEST,
    TOGGLE_FAVORITE_SUCCESS,
    TOGGLE_FAVORITE_FAIL,
    GET_FAVORITES_REQUEST,
    GET_FAVORITES_SUCCESS,
    GET_FAVORITES_FAIL,
    CHECK_FAVORITE_REQUEST,
    CHECK_FAVORITE_SUCCESS,
    CHECK_FAVORITE_FAIL,
    CLEAR_ERRORS
} from '../constants/favoritesConstants';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Toggle favorite (add/remove)
export const toggleFavorite = (productId) => async (dispatch) => {
    try {
        dispatch({ type: TOGGLE_FAVORITE_REQUEST });

        const { data } = await axios.post(`/favorites/${productId}`);

        dispatch({
            type: TOGGLE_FAVORITE_SUCCESS,
            payload: {
                productId,
                isFavorite: data.isFavorite,
                favorites: data.favorites
            }
        });

        // If we're removing from favorites, refresh the favorites list
        if (!data.isFavorite) {
            // Dispatch getFavorites to refresh the list
            dispatch(getUserFavorites());
        }

        return { 
            success: true, 
            isFavorite: data.isFavorite,
            message: data.message 
        };

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la modification des favoris';
        dispatch({
            type: TOGGLE_FAVORITE_FAIL,
            payload: errorMessage
        });
        return { success: false, error: errorMessage };
    }
};

// Get user favorites
export const getUserFavorites = () => async (dispatch) => {
    try {
        dispatch({ type: GET_FAVORITES_REQUEST });

        const { data } = await axios.get(`/favorites`);

        dispatch({
            type: GET_FAVORITES_SUCCESS,
            payload: data.favorites
        });

        return { success: true, favorites: data.favorites };

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur lors du chargement des favoris';
        dispatch({
            type: GET_FAVORITES_FAIL,
            payload: errorMessage
        });
        return { success: false, error: errorMessage };
    }
};

// Check if product is in favorites
export const checkFavorite = (productId) => async (dispatch) => {
    try {
        dispatch({ type: CHECK_FAVORITE_REQUEST });

        const { data } = await axios.get(`/favorites/${productId}`);

        dispatch({
            type: CHECK_FAVORITE_SUCCESS,
            payload: {
                productId,
                isFavorite: data.isFavorite
            }
        });

        return { success: true, isFavorite: data.isFavorite };

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la vérification des favoris';
        dispatch({
            type: CHECK_FAVORITE_FAIL,
            payload: errorMessage
        });
        return { success: false, error: errorMessage };
    }
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};