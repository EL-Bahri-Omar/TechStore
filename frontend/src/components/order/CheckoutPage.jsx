import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, MapPin, Shield } from 'lucide-react';
import { AlertMessages, getFieldError } from '../../utils/alertMessages';
import { saveShippingInfo } from '../../actions/cartActions';
import { error } from '../../actions/alertActions';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { shippingInfo } = useSelector(state => state.cart);
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || shippingInfo?.firstName || '',
    lastName: user?.lastName || shippingInfo?.lastName || '',
    address: user?.address?.address || shippingInfo?.address || '', // FIXED
    city: user?.address?.city || shippingInfo?.city || '', // FIXED
    postalCode: user?.address?.postalCode || shippingInfo?.postalCode || '', // FIXED
    country: user?.address?.country || shippingInfo?.country || '', // FIXED
    phone: user?.phone || shippingInfo?.phone || ''
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
      color: 'shipping-method-standard',
      key: 'shipping-standard'
    },
    {
      id: 'express',
      name: 'Livraison Express',
      price: 9.99,
      duration: '1-2 jours ouvrables',
      color: 'shipping-method-express',
      key: 'shipping-express'
    },
    {
      id: 'priority',
      name: 'Livraison Prioritaire',
      price: 14.99,
      duration: '24h',
      color: 'shipping-method-priority',
      key: 'shipping-priority'
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte de crédit',
      color: 'payment-method-card',
      key: 'payment-card'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      color: 'payment-method-paypal',
      key: 'payment-paypal'
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      color: 'payment-method-applepay',
      key: 'payment-applepay'
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
      dispatch(error(AlertMessages.SHIPPING_INFO_REQUIRED));
      return;
    }

    // Save all required shipping info to Redux store
    dispatch(saveShippingInfo({
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      phone: shippingAddress.phone,
      shippingMethod: shippingMethod,
      paymentMethod: paymentMethod
    }));
    
    navigate('/payment');
  };

  const handleInputChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-content">
          <div className="checkout-empty-icon">
            <Truck size={40} />
          </div>
          <h1>Panier vide</h1>
          <p>Ajoutez des produits pour finaliser votre commande.</p>
          <button 
            onClick={() => navigate('/')}
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
            onClick={() => navigate('/cart')}
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
                {shippingMethods.map((method) => (
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
                    <div className={`method-icon ${method.color}`}>
                      <Truck size={24} />
                    </div>
                    <div className="method-info">
                      <div className="method-name">{method.name}</div>
                      <div className="method-duration">{method.duration}</div>
                    </div>
                    <div className="method-price">
                      <div className="price-amount">{method.price} €</div>
                      <div className="price-label">TTC</div>
                    </div>
                  </label>
                ))}
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
                {paymentMethods.map((method) => (
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
                    <div className={`payment-method-icon ${method.color}`}>
                      <CreditCard size={32} />
                    </div>
                    <span className="payment-method-name">
                      {method.name}
                    </span>
                  </label>
                ))}
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
                <h3>Articles ({cartItems.length})</h3>
                {cartItems.map((item) => (
                  <div key={`checkout-item-${item.id}`} className="summary-item">
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
                      {(item.price * item.quantity).toFixed(2)} €
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
                    <span>{item.value} €</span>
                  </div>
                ))}
                
                <div className="grand-total">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>

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