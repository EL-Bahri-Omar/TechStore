import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { AlertMessages, getFieldError } from '../utils/alertMessages';

const LoginPage = ({ onNavigate }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const { success, error: showError } = useAlert();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Email invalide';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
      if (!formData.firstName) {
        newErrors.firstName = getFieldError('firstName');
      }
      if (!formData.lastName) {
        newErrors.lastName = getFieldError('lastName');
      }
      if (!formData.address) {
        newErrors.address = getFieldError('address');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validate()) {
      showError(AlertMessages.FORM_VALIDATION_ERROR);
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const result = await signup(formData);
        if (result.success) {
          success(AlertMessages.SIGNUP_SUCCESS);
          onNavigate('home');
        } else {
          showError(result.error || AlertMessages.SIGNUP_ERROR);
        }
      } else {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          success(AlertMessages.LOGIN_SUCCESS);
          onNavigate('home');
        } else {
          showError(result.error || AlertMessages.LOGIN_ERROR);
        }
      }
    } catch (err) {
      showError(AlertMessages.NETWORK_ERROR);
    }

    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>
          {isSignup ? 'Créer un compte' : 'Connexion'}
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <div className="form-row">
              <div className="form-group">
                <label>Prénom *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                />
                {errors.firstName && (
                  <p className="field-error">
                    <span className="field-error-icon">⚠</span>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                />
                {errors.lastName && (
                  <p className="field-error">
                    <span className="field-error-icon">⚠</span>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && (
              <p className="field-error">
                <span className="field-error-icon">⚠</span>
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Mot de passe *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`form-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && (
              <p className="field-error">
                <span className="field-error-icon">⚠</span>
                {errors.password}
              </p>
            )}
          </div>

          {isSignup && (
            <>
              <div className="form-group">
                <label>Confirmer le mot de passe *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="field-error">
                    <span className="field-error-icon">⚠</span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Adresse *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  rows="3"
                />
                {errors.address && (
                  <p className="field-error">
                    <span className="field-error-icon">⚠</span>
                    {errors.address}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isSignup ? 'S\'inscrire' : 'Se connecter')}
          </button>
        </form>

        <div className="auth-switch">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setErrors({});
            }}
            className="switch-btn"
          >
            {isSignup ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;