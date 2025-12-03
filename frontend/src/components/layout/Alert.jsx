import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { clearAlert } from '../../actions/alertActions';

const Alert = () => {
    const dispatch = useDispatch();
    const { alerts } = useSelector(state => state.alert);

    if (alerts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return CheckCircle;
            case 'error':
                return XCircle;
            case 'warning':
                return AlertTriangle;
            case 'info':
                return Info;
            default:
                return Info;
        }
    };

    return (
        <div className="alert-container">
            {alerts.map(alert => {
                const Icon = getIcon(alert.type);
                return (
                    <div
                        key={alert.id}
                        className={`alert alert-${alert.type}`}
                    >
                        <div className="alert-icon">
                            <Icon size={20} />
                        </div>
                        <div className="alert-content">
                            {alert.title && <div className="alert-title">{alert.title}</div>}
                            <div className="alert-message">{alert.message}</div>
                        </div>
                        <button
                            onClick={() => dispatch(clearAlert(alert.id))}
                            className="alert-close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default Alert;