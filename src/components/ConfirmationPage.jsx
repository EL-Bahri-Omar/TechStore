import React from 'react';
import { CheckCircle, Package, Truck, Home, Clock, Download, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ConfirmationPage = ({ onNavigate, orderId }) => {
  const { user } = useAuth();

  const steps = [
    { 
      icon: CheckCircle, 
      label: 'Confirmée', 
      status: 'completed', 
      description: 'Commande validée',
      color: 'step-completed'
    },
    { 
      icon: Package, 
      label: 'Préparation', 
      status: 'current', 
      description: 'En cours de préparation',
      color: 'step-current'
    },
    { 
      icon: Truck, 
      label: 'Expédition', 
      status: 'upcoming', 
      description: 'En route vers vous',
      color: 'step-upcoming'
    },
    { 
      icon: Home, 
      label: 'Livrée', 
      status: 'upcoming', 
      description: 'Commande reçue',
      color: 'step-upcoming'
    }
  ];

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* En-tête de confirmation */}
        <div className="confirmation-header">
          <div className="confirmation-icon">
            <CheckCircle size={64} />
          </div>
          <h1>Commande confirmée !</h1>
          <p>
            Merci <span className="confirmation-user-name">{user?.firstName}</span>, votre achat est confirmé.
          </p>
          <div className="order-number">
            <div className="status-dot"></div>
            <p>
              Numéro de commande : <span>{orderId}</span>
            </p>
          </div>
        </div>

        {/* Carte principale */}
        <div className="confirmation-card">
          {/* En-tête de la carte */}
          <div className="card-header">
            <h2>Suivi de votre commande</h2>
          </div>
          
          {/* Étapes de livraison */}
          <div className="tracking-section">
            <div className="tracking-steps">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                
                return (
                  <div key={step.label} className="tracking-step">
                    {/* Cercle d'étape */}
                    <div className={`step-circle ${step.color} ${(isCompleted || isCurrent) ? 'step-pulse' : ''}`}>
                      <Icon size={32} />
                    </div>
                    
                    {/* Texte de l'étape */}
                    <div className="step-info">
                      <div className={`step-label ${(isCompleted || isCurrent) ? 'step-label-active' : 'step-label-inactive'}`}>
                        {step.label}
                      </div>
                      <div className="step-description">
                        {step.description}
                      </div>
                    </div>
                    
                    {/* Ligne de connexion */}
                    {index < steps.length - 1 && (
                      <div className={`step-connector ${isCompleted ? 'connector-active' : 'connector-inactive'}`}></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Informations de livraison */}
            <div className="delivery-info">
              <div className="info-grid">
                <div className="info-item">
                  <Clock size={32} />
                  <h3>Livraison estimée</h3>
                  <p>
                    {estimatedDelivery.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
                
                <div className="info-item">
                  <Package size={32} />
                  <h3>Statut</h3>
                  <p className="status-text">En préparation</p>
                </div>
                
                <div className="info-item">
                  <Truck size={32} />
                  <h3>Transporteur</h3>
                  <p>Livraison Standard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="action-buttons">
          <button
            onClick={() => onNavigate('home')}
            className="action-btn-secondary"
          >
            <Home size={24} />
            <span>Continuer mes achats</span>
          </button>
          
          <button
            onClick={() => onNavigate('orders')}
            className="action-btn-secondary"
          >
            <Package size={24} />
            <span>Voir mes commandes</span>
          </button>
        </div>

        {/* Support */}
        <div className="support-section">
          <h3>Besoin d'aide ?</h3>
          <div className="support-grid">
            <div className="support-item">
              <div className="support-icon">
                <Phone size={32} />
              </div>
              <h4>Service client</h4>
              <p>Du lundi au vendredi</p>
              <p className="support-contact">01 23 45 67 89</p>
            </div>
            
            <div className="support-item">
              <div className="support-icon">
                <Mail size={32} />
              </div>
              <h4>Email</h4>
              <p>Réponse sous 24h</p>
              <p className="support-contact">support@techstore.fr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;