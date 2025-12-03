import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

// Login
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const { data } = await axios.post(`/login`, { email, password });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        });

        return { success: true };

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur de connexion';
        dispatch({
            type: LOGIN_FAIL,
            payload: errorMessage
        });
        return { success: false, error: errorMessage };
    }
};

// Register
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_REQUEST });

        const { data } = await axios.post(`/register`, userData);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: data.user
        });

        return { success: true };

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
        dispatch({
            type: REGISTER_FAIL,
            payload: errorMessage
        });
        return { success: false, error: errorMessage };
    }
};

// Load user
export const loadUser = () => async (dispatch) => {
    try {
        
        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await axios.get(`/me`);

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        });

    } catch (error) {
        console.log('❌ Load user failed');

        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response?.data?.message || 'Erreur lors du chargement de l\'utilisateur'
        });
    }
};

// Logout USER
export const logout = () => async (dispatch) => {
    try {
        await axios.get('/logout');

        dispatch({
            type: LOGOUT_SUCCESS
        });

    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response?.data?.message || 'Erreur lors de la déconnexion'
        });
    }
};

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            // withCredentials: true is already set globally
        };

        console.log('Sending update profile request with cookies...');
        
        const { data } = await axios.put('/me/update', userData, config);

        console.log('Profile update response:', data);

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.user
        });

        return { success: true };

    } catch (error) {
        console.error('Update profile error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: errorMessage
        });
        return { success: false, error: errorMessage };
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};