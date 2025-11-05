import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateProfile(formData);
    if (result.success) {
      setMessage('Profil mis à jour avec succès');
    } else {
      setMessage(result.error);
    }
    
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        
        {message && (
          <div className={`message ${message.includes('succès') ? 'message-success' : 'message-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="form-input"
              required
            />
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