import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddressesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Veuillez vous connecter pour gérer vos adresses.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary mt-4">
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
              <h3 className="address-title">Adresse {index + 1}</h3>
              <p className="address-text">{address.address}</p>
              <p className="address-text">{address.postalCode} {address.city}</p>
              <p className="address-text">{address.country}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-state-text">Vous n'avez pas encore d'adresse enregistrée.</p>
          <p className="empty-state-subtext">
            Vos adresses apparaîtront ici après avoir passé une commande.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;