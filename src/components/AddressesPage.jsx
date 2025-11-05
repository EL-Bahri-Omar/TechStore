import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AddressesPage = ({ onNavigate }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Veuillez vous connecter pour gérer vos adresses.</p>
          <button onClick={() => onNavigate('login')} className="btn btn-primary mt-4">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="page-title mb-8">Mes adresses</h1>
      
      {user.addresses && user.addresses.length > 0 ? (
        <div className="addresses-grid">
          {user.addresses.map((address, index) => (
            <div key={index} className="address-card">
              <p className="address-text">{address}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-state-text">Vous n'avez pas encore d'adresse enregistrée.</p>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;