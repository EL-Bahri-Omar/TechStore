import React from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Download, RotateCcw, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const OrdersPage = ({ onNavigate }) => {
  const { user } = useAuth();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <Clock className="status-icon-white" size={24} />;
      case 'shipped':
        return <Truck className="status-icon-white" size={24} />;
      case 'delivered':
        return <CheckCircle className="status-icon-white" size={24} />;
      default:
        return <Package className="status-icon-white" size={24} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      default:
        return 'En traitement';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'badge-warning';
      case 'shipped':
        return 'badge-info';
      case 'delivered':
        return 'badge-success';
      default:
        return 'badge-default';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-gradient-warning';
      case 'shipped':
        return 'status-gradient-info';
      case 'delivered':
        return 'status-gradient-success';
      default:
        return 'status-gradient-default';
    }
  };

  if (!user) {
    return (
      <div className="orders-login-required">
        <div className="login-required-content">
          <div className="login-required-icon">
            <Package size={40} />
          </div>
          <h1>Connexion requise</h1>
          <p>Veuillez vous connecter pour voir vos commandes.</p>
          <button 
            onClick={() => onNavigate('login')} 
            className="btn-primary-lg"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const orders = user.orders || [];

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* En-tête */}
        <div className="orders-header">
          <div>
            <h1>Mes commandes</h1>
            <p>Retrouvez l'historique complet de vos achats et suivez l'état de vos commandes</p>
          </div>

          {/* Statistiques */}
        {orders.length > 0 && (
          <div className="orders-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={28} />
              </div>
              <p>Commandes totales : </p>      
              <h3>{orders.length}</h3>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon stat-icon-success">
                <CheckCircle size={28} />
              </div>
              <p>Commandes livrées : </p>
              <h3>{orders.filter(order => order.status === 'delivered').length}</h3>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon stat-icon-info">
                <Truck size={28} />
              </div>
              <p>En cours de livraison : </p>
              <h3>{orders.filter(order => order.status === 'shipped').length}</h3>
            </div>
          </div>
          )}
          
        </div>

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((order) => (
                <div key={order.id} className="order-card">
                  {/* En-tête de la commande */}
                  <div className={`order-header ${getStatusGradient(order.status)}`}>
                    <div className="order-header-content">
                      <div className="order-info">
                        <h3>Commande {order.id}</h3>
                        <p>
                          Passée le {new Date(order.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="order-status">
                        {getStatusIcon(order.status)}
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="order-content">
                    <div className="order-details-grid">
                      {/* Adresse de livraison */}
                      <div className="order-detail-section">
                        <div className="detail-header">
                          <div className="detail-icon">
                            <MapPin size={20} />
                          </div>
                          <h4>Adresse de livraison</h4>
                        </div>
                        <div className="detail-content">
                          <p className="detail-name">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          </p>
                          <p>{order.shippingAddress.address}</p>
                          <p>
                            {order.shippingAddress.postalCode} {order.shippingAddress.city}
                          </p>
                          <p className="detail-country">{order.shippingAddress.country}</p>
                        </div>
                      </div>

                      {/* Informations de livraison et paiement */}
                      <div className="order-detail-section">
                        <div className="detail-grid">
                          <div className="detail-item">
                            <div className="detail-item-header">
                              <Truck size={18} />
                              <h4>Livraison</h4>
                            </div>
                            <div className="detail-item-content">
                              <p className="detail-item-title">{order.shippingMethod.name}</p>
                              <p className="detail-item-description">{order.shippingMethod.duration}</p>
                              <p className="detail-item-price">{order.shippingMethod.price}€</p>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-item-header">
                              <CreditCard size={18} />
                              <h4>Paiement</h4>
                            </div>
                            <div className="detail-item-content">
                              <p className="detail-item-title">
                                {order.paymentMethod === 'card' && 'Carte de crédit'}
                                {order.paymentMethod === 'paypal' && 'PayPal'}
                                {order.paymentMethod === 'applepay' && 'Apple Pay'}
                              </p>
                              <p className="detail-item-description">Paiement sécurisé</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Articles commandés */}
                    <div className="order-items-section">
                      <h4 className="order-items-title">
                        <Package size={24} />
                        Articles commandés ({order.items.length})
                      </h4>
                      <div className="order-items-list">
                        {order.items.map((item) => (
                          <div key={item.id} className="order-item">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="order-item-image"
                            />
                            <div className="order-item-info">
                              <h5>{item.name}</h5>
                              <p>Quantité: {item.quantity}</p>
                              <p>{item.price}€ l'unité</p>
                            </div>
                            <div className="order-item-total">
                              <p>{(item.price * item.quantity).toFixed(2)}€</p>
                              <p>Total</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total et actions */}
                    <div className="order-footer">
                      <div className="order-summary">
                        <div className="order-summary-info">
                          {order.items.length} article(s) • Livraison: {order.shippingMethod.price}€
                        </div>
                        <div className="order-total">
                          <p>{order.orderSummary.total.toFixed(2)}€</p>
                          <p>Dont {order.orderSummary.tax.toFixed(2)}€ de TVA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="empty-orders">
            <div className="empty-orders-content">
              <div className="empty-orders-icon">
                <Package size={64} />
              </div>
              <h3>Aucune commande pour le moment</h3>
              <p>
                Vous n'avez pas encore passé de commande. Découvrez nos produits et trouvez 
                ce qui vous convient le mieux.
              </p>
              <button 
                onClick={() => onNavigate('home')} 
                className="btn-primary-lg"
              >
                Découvrir nos produits
              </button>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default OrdersPage;