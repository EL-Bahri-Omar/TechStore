import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { AlertMessages, getFieldError } from '../utils/alertMessages';

const ProfilePage = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const { success, error: showError } = useAlert();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = getFieldError('firstName');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = getFieldError('lastName');
    }
    if (!formData.email.trim()) {
      newErrors.email = getFieldError('email');
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Veuillez saisir une adresse email valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      showError(AlertMessages.FORM_VALIDATION_ERROR);
      return;
    }

    setLoading(true);
    
    const result = await updateProfile(formData);
    if (result.success) {
      success(AlertMessages.PROFILE_UPDATE_SUCCESS);
    } else {
      showError(result.error || AlertMessages.PROFILE_UPDATE_ERROR);
    }
    
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Veuillez vous connecter pour accéder à votre profil.</p>
          <button onClick={() => onNavigate('login')} className="btn btn-primary mt-4">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="profile-container">
        <h1 className="page-title mb-8">Mon profil</h1>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                required
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
                required
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
              required
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
            />
          </div>

          <div className="form-group">
            <label>Adresse principale</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="form-input"
              rows="3"
              placeholder="Votre adresse principale (facultatif)"
            />
            <p className="form-help-text">
              Cette adresse sera utilisée comme adresse par défaut pour vos commandes.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;