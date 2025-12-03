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

const initialState = {
    favorites: [],
    loading: false,
    error: null,
    checkLoading: false
};

export const favoritesReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_FAVORITE_REQUEST:
        case GET_FAVORITES_REQUEST:
            return {
                ...state,
                loading: true
            };

        case CHECK_FAVORITE_REQUEST:
            return {
                ...state,
                checkLoading: true
            };

        case TOGGLE_FAVORITE_SUCCESS:
            return {
                ...state,
                loading: false,
                favorites: action.payload.favorites
            };

        case GET_FAVORITES_SUCCESS:
            return {
                ...state,
                loading: false,
                favorites: action.payload
            };

        case CHECK_FAVORITE_SUCCESS:
        case CHECK_FAVORITE_FAIL:
            return {
                ...state,
                checkLoading: false
            };

        case TOGGLE_FAVORITE_FAIL:
        case GET_FAVORITES_FAIL:
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