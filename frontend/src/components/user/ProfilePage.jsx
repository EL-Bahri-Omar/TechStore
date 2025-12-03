import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../actions/userActions';
import { success, error } from '../../actions/alertActions';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { loading: updateLoading } = useSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      address: '',
      city: '',
      postalCode: '',
      country: ''
    }
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          address: '',
          city: '',
          postalCode: '',
          country: ''
        }
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
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
      dispatch(error('Veuillez corriger les erreurs dans le formulaire'));
      return;
    }

    try {
      const result = await dispatch(updateProfile(formData));
      if (result.success) {
        dispatch(success('Profil mis à jour avec succès'));
      } else {
        dispatch(error(result.error || 'Erreur lors de la mise à jour du profil'));
      }
    } catch (err) {
      dispatch(error('Erreur lors de la mise à jour du profil'));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  // Check authentication state
  if (!isAuthenticated || !user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Veuillez vous connecter pour accéder à votre profil.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary mt-4">
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
          <div className="form-section">
            <h2 className="section-title">Informations personnelles</h2>
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
                placeholder="Votre numéro de téléphone"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Adresse principale</h2>
            <div className="form-group">
              <label>Adresse</label>
              <input
                type="text"
                value={formData.address.address || ''}
                onChange={(e) => handleAddressChange('address', e.target.value)}
                className="form-input"
                placeholder="Numéro et nom de rue"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ville</label>
                <input
                  type="text"
                  value={formData.address.city || ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="form-input"
                  placeholder="Ville"
                />
              </div>
              
              <div className="form-group">
                <label>Code postal</label>
                <input
                  type="text"
                  value={formData.address.postalCode || ''}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  className="form-input"
                  placeholder="Code postal"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pays</label>
              <input
                type="text"
                value={formData.address.country || ''}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className="form-input"
                placeholder="Pays"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={updateLoading}
          >
            {updateLoading ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;