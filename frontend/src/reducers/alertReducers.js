import {
    SHOW_SUCCESS,
    SHOW_ERROR,
    SHOW_WARNING,
    SHOW_INFO,
    CLEAR_ALERT
} from '../constants/alertConstants';

export const alertReducer = (state = { alerts: [] }, action) => {
    switch (action.type) {
        case SHOW_SUCCESS:
        case SHOW_ERROR:
        case SHOW_WARNING:
        case SHOW_INFO:
            return {
                ...state,
                alerts: [...state.alerts, {
                    id: Date.now().toString(),
                    type: action.type.replace('SHOW_', '').toLowerCase(),
                    title: action.payload.title,
                    message: action.payload.message,
                    autoClose: true,
                    duration: 5000
                }]
            };
        case CLEAR_ALERT:
            return {
                ...state,
                alerts: state.alerts.filter(alert => alert.id !== action.payload)
            };
        default:
            return state;
    }
};