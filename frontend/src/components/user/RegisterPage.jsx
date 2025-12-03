import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AlertMessages, getFieldError } from '../../utils/alertMessages';
import { register } from '../../actions/userActions';
import { success, error } from '../../actions/alertActions';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Email invalide';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = getFieldError('firstName');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = getFieldError('lastName');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validate()) {
      dispatch(error(AlertMessages.FORM_VALIDATION_ERROR));
      return;
    }

    try {
      const result = await dispatch(register(formData));
      if (result.success) {
        dispatch(success(AlertMessages.SIGNUP_SUCCESS));
        navigate('/');
      } else {
        dispatch(error(result.error || AlertMessages.SIGNUP_ERROR));
      }
    } catch (err) {
      dispatch(error(AlertMessages.NETWORK_ERROR));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Créer un compte</h2>
          <p>Rejoignez TechStore et découvrez nos produits</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="Votre prénom"
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
                placeholder="Votre nom"
              />
              {errors.lastName && (
                <p className="field-error">
                  <span className="field-error-icon">⚠</span>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="votre@email.com"
            />
            {errors.email && (
              <p className="field-error">
                <span className="field-error-icon">⚠</span>
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="form-input"
              placeholder="Votre numéro de téléphone (optionnel)"
            />
          </div>

          <div className="form-group">
            <label>Mot de passe *</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`form-input password-input ${errors.password ? 'error' : ''}`}
                placeholder="Au moins 6 caractères"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="field-error">
                <span className="field-error-icon">⚠</span>
                {errors.password}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe *</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`form-input password-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={toggleConfirmPasswordVisibility}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="field-error">
                <span className="field-error-icon">⚠</span>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-switch">
          <p>Déjà un compte ?</p>
          <Link to="/login" className="switch-link">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;