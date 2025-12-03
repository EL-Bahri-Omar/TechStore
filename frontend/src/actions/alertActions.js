import {
    SHOW_SUCCESS,
    SHOW_ERROR,
    SHOW_WARNING,
    SHOW_INFO,
    CLEAR_ALERT
} from '../constants/alertConstants';

// Success alert
export const success = (message, title = 'Succès') => async (dispatch) => {
    const id = Date.now().toString();
    dispatch({
        type: SHOW_SUCCESS,
        payload: { title, message, id }
    });

    // Auto clear after 5 seconds
    setTimeout(() => {
        dispatch(clearAlert(id));
    }, 5000);

    return id;
};

// Error alert
export const error = (message, title = 'Erreur') => async (dispatch) => {
    const id = Date.now().toString();
    dispatch({
        type: SHOW_ERROR,
        payload: { title, message, id }
    });

    setTimeout(() => {
        dispatch(clearAlert(id));
    }, 5000);

    return id;
};

// Warning alert
export const warning = (message, title = 'Attention') => async (dispatch) => {
    const id = Date.now().toString();
    dispatch({
        type: SHOW_WARNING,
        payload: { title, message, id }
    });

    setTimeout(() => {
        dispatch(clearAlert(id));
    }, 5000);

    return id;
};

// Info alert
export const info = (message, title = 'Information') => async (dispatch) => {
    const id = Date.now().toString();
    dispatch({
        type: SHOW_INFO,
        payload: { title, message, id }
    });

    setTimeout(() => {
        dispatch(clearAlert(id));
    }, 5000);

    return id;
};

// Clear specific alert
export const clearAlert = (id) => async (dispatch) => {
    dispatch({
        type: CLEAR_ALERT,
        payload: id
    });
};