import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AlertMessages } from '../../utils/alertMessages';
import { login } from '../../actions/userActions';
import { success, error } from '../../actions/alertActions';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

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
      const result = await dispatch(login(formData.email, formData.password));
      if (result.success) {
        dispatch(success(AlertMessages.LOGIN_SUCCESS));
        navigate('/');
      } else {
        dispatch(error(result.error || AlertMessages.LOGIN_ERROR));
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

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Connexion</h2>
          <p>Connectez-vous à votre compte TechStore</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
            <label>Mot de passe *</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`form-input password-input ${errors.password ? 'error' : ''}`}
                placeholder="Votre mot de passe"
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

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-switch">
          <p>Pas encore de compte ?</p>
          <Link to="/register" className="switch-link">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;