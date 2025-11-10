import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const showAlert = useCallback((alert) => {
    const id = Date.now().toString();
    const newAlert = {
      id,
      ...alert,
      autoClose: alert.autoClose !== false,
      duration: alert.duration || 5000
    };

    setAlerts(prev => [...prev, newAlert]);

    if (newAlert.autoClose) {
      setTimeout(() => {
        removeAlert(id);
      }, newAlert.duration);
    }

    return id;
  }, [removeAlert]);

  const success = useCallback((message, title = 'Succès') => {
    return showAlert({
      type: 'success',
      title,
      message,
      icon: CheckCircle
    });
  }, [showAlert]);

  const error = useCallback((message, title = 'Erreur') => {
    return showAlert({
      type: 'error',
      title,
      message,
      icon: XCircle
    });
  }, [showAlert]);

  const warning = useCallback((message, title = 'Attention') => {
    return showAlert({
      type: 'warning',
      title,
      message,
      icon: AlertTriangle
    });
  }, [showAlert]);

  const info = useCallback((message, title = 'Information') => {
    return showAlert({
      type: 'info',
      title,
      message,
      icon: Info
    });
  }, [showAlert]);

  const AlertComponent = () => {
    if (alerts.length === 0) return null;

    return (
      <div className="alert-container">
        {alerts.map(alert => {
          const Icon = alert.icon;
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
                onClick={() => removeAlert(alert.id)}
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

  const value = {
    alerts,
    showAlert,
    removeAlert,
    success,
    error,
    warning,
    info
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertComponent />
    </AlertContext.Provider>
  );
};