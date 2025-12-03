import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard } from 'lucide-react';
import { myOrders } from '../../actions/orderActions';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector(state => state.auth);
  const { orders, loading } = useSelector(state => state.myOrders);

  // Fetch user orders from Redux
  useEffect(() => {
    if (user) {
      dispatch(myOrders());
    }
  }, [dispatch, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shipped':
        return <Truck className="status-icon-white" size={24} />;
      case 'Delivered':
        return <CheckCircle className="status-icon-white" size={24} />;
      case 'Processing':
      default:
        return <Package className="status-icon-white" size={24} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Shipped':
        return 'Expédiée';
      case 'Delivered':
        return 'Livrée';
      case 'Processing':
      default:
        return 'En traitement';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shipped':
        return 'badge-info';
      case 'Delivered':
        return 'badge-success';
      case 'Processing':
      default:
        return 'badge-default';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'Shipped':
        return 'status-gradient-info';
      case 'Delivered':
        return 'status-gradient-success';
      case 'Processing':
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
            onClick={() => navigate('/login')} 
            className="btn-primary-lg"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loading">Chargement de vos commandes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <div>
            <h1>Mes commandes</h1>
            <p>Retrouvez l'historique complet de vos achats et suivez l'état de vos commandes</p>
          </div>

          {/* Statistiques */}
          {orders && orders.length > 0 && (
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
                <h3>{orders.filter(order => order.orderStatus === 'Delivered').length}</h3>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon stat-icon-info">
                  <Truck size={28} />
                </div>
                <p>En cours de livraison : </p>
                <h3>{orders.filter(order => order.orderStatus === 'Shipped').length}</h3>
              </div>
            </div>
          )}
        </div>

        {orders && orders.length > 0 ? (
          <div className="orders-list">
            {orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <div key={order._id} className="order-card">
                  <div className={`order-header ${getStatusGradient(order.orderStatus)}`}>
                    <div className="order-header-content">
                      <div className="order-info">
                        <h3>Commande {order._id?.slice(-8) || order._id}</h3>
                        <p>
                          Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="order-status">
                        {getStatusIcon(order.orderStatus)}
                        <span className={`status-badge ${getStatusColor(order.orderStatus)}`}>
                          {getStatusText(order.orderStatus)}
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
                            {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                          </p>
                          <p>{order.shippingInfo.address}</p>
                          <p>
                            {order.shippingInfo.postalCode} {order.shippingInfo.city}
                          </p>
                          <p className="detail-country">{order.shippingInfo.country}</p>
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
                              <p className="detail-item-title">Standard</p>
                              <p className="detail-item-description">3-5 jours ouvrables</p>
                              <p className="detail-item-price">{order.shippingPrice?.toFixed(2) || '0.00'} €</p>
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
                                {order.paymentMethod === 'bank_transfer' && 'Virement bancaire'}
                                {order.paymentMethod || 'Non spécifié'}
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
                        Articles commandés ({order.orderItems?.length || 0})
                      </h4>
                      <div className="order-items-list">
                        {order.orderItems?.map((item) => (
                          <div key={item._id || item.id} className="order-item">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="order-item-image"
                            />
                            <div className="order-item-info">
                              <h5>{item.name}</h5>
                              <p>Quantité: {item.quantity}</p>
                              <p>{item.price} € l'unité</p>
                            </div>
                            <div className="order-item-total">
                              <p>{(item.price * item.quantity).toFixed(2)} €</p>
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
                          {order.orderItems?.length || 0} article(s) • Livraison: {order.shippingPrice?.toFixed(2) || '0.00'} €
                        </div>
                        <div className="order-total">
                          <p>{order.totalPrice?.toFixed(2) || '0.00'} €</p>
                          <p>Dont {((order.totalPrice - order.shippingPrice) * 0.2).toFixed(2)} € de TVA</p>
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
                onClick={() => navigate('/')} 
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