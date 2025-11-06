import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Truck, MapPin, Shield } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { AlertMessages, getFieldError } from '../utils/alertMessages';

const CheckoutPage = ({ onNavigate }) => {
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  const { error: showError } = useAlert();
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    country: '',
    phone: user?.phone || ''
  });

  const [errors, setErrors] = useState({});
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Livraison Standard',
      price: 4.99,
      duration: '3-5 jours ouvrables',
      icon: Truck,
      color: 'shipping-method-standard'
    },
    {
      id: 'express',
      name: 'Livraison Express',
      price: 9.99,
      duration: '1-2 jours ouvrables',
      icon: Truck,
      color: 'shipping-method-express'
    },
    {
      id: 'priority',
      name: 'Livraison Prioritaire',
      price: 14.99,
      duration: '24h',
      icon: Truck,
      color: 'shipping-method-priority'
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte de crédit',
      icon: CreditCard,
      color: 'payment-method-card'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: CreditCard,
      color: 'payment-method-paypal'
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      icon: CreditCard,
      color: 'payment-method-applepay'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingAddress.firstName.trim()) newErrors.firstName = getFieldError('firstName');
    if (!shippingAddress.lastName.trim()) newErrors.lastName = getFieldError('lastName');
    if (!shippingAddress.address.trim()) newErrors.address = getFieldError('address');
    if (!shippingAddress.city.trim()) newErrors.city = getFieldError('city');
    if (!shippingAddress.postalCode.trim()) newErrors.postalCode = getFieldError('postalCode');
    if (!shippingAddress.country.trim()) newErrors.country = getFieldError('country');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      showError(AlertMessages.SHIPPING_INFO_REQUIRED);
      return;
    }
    
    onNavigate('payment', {
      shippingAddress,
      shippingMethod: shippingMethods.find(method => method.id === shippingMethod),
      paymentMethod,
      orderSummary: { subtotal, shipping: shippingCost, tax, total }
    });
  };

  const handleInputChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-content">
          <div className="checkout-empty-icon">
            <Truck size={40} />
          </div>
          <h1>Panier vide</h1>
          <p>Ajoutez des produits pour finaliser votre commande.</p>
          <button 
            onClick={() => onNavigate('home')} 
            className="btn-primary-lg"
          >
            Découvrir les produits
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shippingCost = shippingMethods.find(method => method.id === shippingMethod)?.price || 0;
  const tax = subtotal * 0.2;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button
            onClick={() => onNavigate('cart')}
            className="back-button"
          >
            <ChevronLeft size={20} />
            <span>Retour au panier</span>
          </button>
          
          <div className="checkout-steps">
            <h1>Finaliser la commande</h1>
            <div className="progress-steps">
              {['Panier', 'Livraison', 'Paiement', 'Confirmation'].map((step, index) => (
                <div key={step} className="progress-step-container">
                  <div className={`progress-step ${
                    index === 0 
                      ? 'progress-step-completed' 
                      : index === 1
                      ? 'progress-step-active'
                      : 'progress-step-upcoming'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`step-label ${index <= 1 ? 'step-active' : 'step-inactive'}`}>
                    {step}
                  </span>
                  {index < 3 && (
                    <div className={`step-connector ${index < 1 ? 'connector-active' : 'connector-inactive'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            {/* Adresse de livraison */}
            <div className="checkout-section">
              <div className="section-header">
                <div className="section-icon">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2>Adresse de livraison</h2>
                  <p>Où souhaitez-vous recevoir votre commande ?</p>
                </div>
              </div>
              
              <div className="address-form">
                {[
                  { label: 'Prénom', name: 'firstName', required: true, type: 'text' },
                  { label: 'Nom', name: 'lastName', required: true, type: 'text' },
                  { label: 'Ville', name: 'city', required: true, type: 'text' },
                  { label: 'Code postal', name: 'postalCode', required: true, type: 'text' },
                ].map((field) => (
                  <div key={field.name} className="form-group-enhanced">
                    <label>
                      {field.label} {field.required && '*'}
                    </label>
                    <input
                      type={field.type}
                      value={shippingAddress[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className={`form-input-enhanced ${errors[field.name] ? 'error' : ''}`}
                      required={field.required}
                    />
                    {errors[field.name] && (
                      <p className="field-error">
                        <span className="field-error-icon">⚠</span>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
                
                <div className="form-group-full">
                  <label>
                    Adresse complète *
                  </label>
                  <textarea
                    value={shippingAddress.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`form-input-enhanced ${errors.address ? 'error' : ''}`}
                    rows="3"
                    required
                  />
                  {errors.address && (
                    <p className="field-error">
                      <span className="field-error-icon">⚠</span>
                      {errors.address}
                    </p>
                  )}
                </div>
                
                <div className="form-group-enhanced">
                  <label>
                    Pays *
                  </label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`form-input-enhanced ${errors.country ? 'error' : ''}`}
                  >
                    <option value="">Sélectionnez un pays</option>
                    <option value="Tunisie">Tunisie</option>
                    <option value="Algérie">Algérie</option>
                    <option value="Maroc">Maroc</option>
                    <option value="France">France</option>
                  </select>
                  {errors.country && (
                    <p className="field-error">
                      <span className="field-error-icon">⚠</span>
                      {errors.country}
                    </p>
                  )}
                </div>
                
                <div className="form-group-enhanced">
                  <label>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input-enhanced"
                  />
                </div>
              </div>
            </div>

            {/* Mode de livraison */}
            <div className="checkout-section">
              <div className="section-header">
                <div className="section-icon shipping-icon">
                  <Truck size={24} />
                </div>
                <div>
                  <h2>Mode de livraison</h2>
                  <p>Choisissez comment vous souhaitez recevoir vos articles</p>
                </div>
              </div>
              
              <div className="shipping-methods">
                {shippingMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label 
                      key={method.id} 
                      className={`shipping-method-card ${
                        shippingMethod === method.id ? 'shipping-method-card-active' : 'shipping-method-card-inactive'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="hidden"
                      />
                      <div className={`radio-indicator ${
                        shippingMethod === method.id ? 'radio-checked' : 'radio-unchecked'
                      }`}>
                        {shippingMethod === method.id && (
                          <div className="radio-dot"></div>
                        )}
                      </div>
                      <div className={`method-icon ${method.color}`}>
                        <Icon size={24} />
                      </div>
                      <div className="method-info">
                        <div className="method-name">{method.name}</div>
                        <div className="method-duration">{method.duration}</div>
                      </div>
                      <div className="method-price">
                        <div className="price-amount">{method.price}€</div>
                        <div className="price-label">TTC</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="checkout-section">
              <div className="section-header">
                <div className="section-icon payment-icon">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2>Mode de paiement</h2>
                  <p>Comment souhaitez-vous payer ?</p>
                </div>
              </div>
              
              <div className="payment-methods">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label 
                      key={method.id}
                      className={`payment-method-card ${
                        paymentMethod === method.id ? 'payment-method-card-active' : 'payment-method-card-inactive'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />
                      <div className={`payment-radio-indicator ${
                        paymentMethod === method.id ? 'payment-radio-checked' : 'payment-radio-unchecked'
                      }`}>
                        {paymentMethod === method.id && (
                          <div className="payment-radio-dot"></div>
                        )}
                      </div>
                      <div className={`payment-method-icon ${method.color}`}>
                        <Icon size={32} />
                      </div>
                      <span className="payment-method-name">
                        {method.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="checkout-summary">
            <div className="summary-card">
              <div className="summary-header">
                <Shield size={24} />
                <h2>Récapitulatif</h2>
              </div>
              
              {/* Articles */}
              <div className="summary-items">
                <h3>Articles ({cart.length})</h3>
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Qté: {item.quantity}</p>
                    </div>
                    <div className="item-total">
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="summary-totals">
                {[
                  { label: 'Sous-total', value: subtotal.toFixed(2) },
                  { label: 'Livraison', value: shippingCost.toFixed(2) },
                  { label: 'TVA (20%)', value: tax.toFixed(2) },
                ].map((item, index) => (
                  <div key={index} className="total-row">
                    <span>{item.label}</span>
                    <span>{item.value}€</span>
                  </div>
                ))}
                
                <div className="grand-total">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>

              {/* Moved the payment button here */}
              <button 
                onClick={handleSubmit}
                className="btn-primary-xl"
              >
                Procéder au paiement
                <CreditCard size={20} />
              </button>

              <div className="security-notice">
                <Shield size={16} />
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;