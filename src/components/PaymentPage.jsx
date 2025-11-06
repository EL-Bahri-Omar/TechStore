import React, { useState } from 'react';
import { ChevronLeft, Shield, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { AlertMessages } from '../utils/alertMessages';

const PaymentPage = ({ onNavigate, orderData }) => {
  const { cart, createOrder } = useCart();
  const { user } = useAuth();
  const { error: showError, success: showSuccess } = useAlert();
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateCardDetails = () => {
    const newErrors = {};
    
    if (!cardDetails.number.trim()) {
      newErrors.number = 'Le numéro de carte est requis';
    } else if (cardDetails.number.replace(/\s/g, '').length !== 16) {
      newErrors.number = 'Le numéro de carte doit contenir 16 chiffres';
    }
    
    if (!cardDetails.name.trim()) {
      newErrors.name = 'Le nom sur la carte est requis';
    }
    
    if (!cardDetails.expiry.trim()) {
      newErrors.expiry = "La date d'expiration est requise";
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      newErrors.expiry = "Format invalide (MM/AA requis)";
    }
    
    if (!cardDetails.cvv.trim()) {
      newErrors.cvv = 'Le code de sécurité est requis';
    } else if (cardDetails.cvv.length !== 3) {
      newErrors.cvv = 'Le code CVV doit contenir 3 chiffres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e?.preventDefault();
    
    if (!validateCardDetails()) {
      showError(AlertMessages.PAYMENT_INFO_REQUIRED);
      return;
    }

    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const result = await createOrder({
          shippingAddress: orderData.shippingAddress,
          shippingMethod: orderData.shippingMethod,
          paymentMethod: orderData.paymentMethod,
          orderSummary: orderData.orderSummary
        });

        if (result.success) {
          showSuccess(AlertMessages.PAYMENT_SUCCESS);
          setIsSuccess(true);
          setTimeout(() => {
            onNavigate('confirmation', result.orderId);
          }, 2000);
        } else {
          showError(result.error || AlertMessages.PAYMENT_ERROR);
          setIsProcessing(false);
        }
      } catch (error) {
        showError(AlertMessages.PAYMENT_ERROR);
        setIsProcessing(false);
      }
    }, 3000);
  };

  const handleInputChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const formatCVV = (value) => {
    return value.replace(/\D/g, '').slice(0, 3);
  };

  if (isSuccess) {
    return (
      <div className="payment-success">
        <div className="payment-success-content">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
          <h1>Paiement réussi !</h1>
          <p>Redirection vers la confirmation...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header avec étapes */}
        <div className="payment-header">
          <button
            onClick={() => onNavigate('checkout')}
            className="back-button"
          >
            <ChevronLeft size={20} />
            <span>Retour au checkout</span>
          </button>
          
          <div className="payment-steps">
            <h1>Paiement sécurisé</h1>
            <div className="progress-steps">
              {['Panier', 'Livraison', 'Paiement', 'Confirmation'].map((step, index) => (
                <div key={step} className="progress-step-container">
                  <div className={`progress-step ${
                    index <= 1 
                      ? 'progress-step-completed' 
                      : index === 2
                      ? 'progress-step-active'
                      : 'progress-step-upcoming'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`step-label ${index <= 2 ? 'step-active' : 'step-inactive'}`}>
                    {step}
                  </span>
                  {index < 3 && (
                    <div className={`step-connector ${index < 2 ? 'connector-active' : 'connector-inactive'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="payment-content">
          {/* Formulaire de paiement */}
          <div className="payment-form-section">
            <div className="payment-form-card">
              <div className="payment-form-header">
                <div className="payment-form-icon">
                  <Lock size={24} />
                </div>
                <div>
                  <h2>Informations de paiement</h2>
                  <p>Saisissez les détails de votre carte en toute sécurité</p>
                </div>
              </div>

              <div className="payment-form">
                {/* Carte visuelle améliorée */}
                <div className="payment-card-visual">
                  <div className="card-header">
                    <div className="card-logos">
                      <div className="card-logo-yellow"></div>
                      <div className="card-logo-red"></div>
                    </div>
                    <div className="card-balance">
                      <div>Solde disponible</div>
                      <div>{orderData?.orderSummary?.total.toFixed(2)}€</div>
                    </div>
                  </div>
                  <div className="card-number">
                    {cardDetails.number || '•••• •••• •••• ••••'}
                  </div>
                  <div className="card-footer">
                    <div>
                      <div>Titulaire de la carte</div>
                      <div>{cardDetails.name || 'VOTRE NOM'}</div>
                    </div>
                    <div className="card-expiry">
                      <div>Date d'expiration</div>
                      <div>{cardDetails.expiry || 'MM/AA'}</div>
                    </div>
                  </div>
                </div>

                {/* Champs du formulaire */}
                <div className="payment-form-fields">
                  <div className="form-group-enhanced">
                    <label>
                      Numéro de carte *
                    </label>
                    <div className="input-with-icon">
                      <CreditCard className="input-icon" size={20} />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => handleInputChange('number', formatCardNumber(e.target.value))}
                        className={`form-input-enhanced card-number-input ${errors.number ? 'error' : ''}`}
                        maxLength="19"
                        required
                      />
                    </div>
                    {errors.number && (
                      <p className="field-error">
                        <span className="field-error-icon">⚠</span>
                        {errors.number}
                      </p>
                    )}
                  </div>

                  <div className="form-group-enhanced">
                    <label>
                      Nom sur la carte *
                    </label>
                    <input
                      type="text"
                      placeholder="JEAN DUPONT"
                      value={cardDetails.name}
                      onChange={(e) => handleInputChange('name', e.target.value.toUpperCase())}
                      className={`form-input-enhanced card-name-input ${errors.name ? 'error' : ''}`}
                      required
                    />
                    {errors.name && (
                      <p className="field-error">
                        <span className="field-error-icon">⚠</span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="form-group-enhanced">
                    <label>
                      Date d'expiration *
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={cardDetails.expiry}
                      onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
                      className={`form-input-enhanced ${errors.expiry ? 'error' : ''}`}
                      maxLength="5"
                      required
                    />
                    {errors.expiry && (
                      <p className="field-error">
                        <span className="field-error-icon">⚠</span>
                        {errors.expiry}
                      </p>
                    )}
                  </div>

                  <div className="form-group-enhanced">
                    <label>
                      Code de sécurité *
                    </label>
                    <div className="input-with-icon">
                      <Shield className="input-icon" size={20} />
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleInputChange('cvv', formatCVV(e.target.value))}
                        className={`form-input-enhanced card-cvv-input ${errors.cvv ? 'error' : ''}`}
                        maxLength="3"
                        required
                      />
                    </div>
                    {errors.cvv && (
                      <p className="field-error">
                        <span className="field-error-icon">⚠</span>
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sécurité */}
                <div className="security-notice-card">
                  <div className="security-content">
                    <div className="security-icon">
                      <Shield size={24} />
                    </div>
                    <div>
                      <div className="security-title">
                        Paiement 100% sécurisé
                      </div>
                      <div className="security-description">
                        Vos données bancaires sont cryptées et protégées par la technologie SSL
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="payment-summary">
            <div className="summary-card">
              <h2>Votre commande</h2>
              
              <div className="summary-content">
                <div className="summary-section">
                  <h3>
                    <CreditCard size={18} />
                    Livraison
                  </h3>
                  <div className="shipping-address">
                    <p>
                      {orderData?.shippingAddress?.firstName} {orderData?.shippingAddress?.lastName}
                    </p>
                    <p>
                      {orderData?.shippingAddress?.address}<br />
                      {orderData?.shippingAddress?.postalCode} {orderData?.shippingAddress?.city}
                    </p>
                    {!user && (
                      <p className="guest-notice">
                        Commande en tant qu'invité
                      </p>
                    )}
                  </div>
                </div>

                <div className="summary-section">
                  <h3>Articles</h3>
                  <div className="order-items-summary">
                    {cart.map((item) => (
                      <div key={item.id} className="order-item-summary">
                        <div>
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                        <span>{(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summary-totals">
                  {[
                    { label: 'Sous-total', value: orderData?.orderSummary?.subtotal.toFixed(2) },
                    { label: 'Livraison', value: orderData?.orderSummary?.shipping.toFixed(2) },
                    { label: 'TVA (20%)', value: orderData?.orderSummary?.tax.toFixed(2) },
                  ].map((item, index) => (
                    <div key={index} className="total-row">
                      <span>{item.label}</span>
                      <span>{item.value}€</span>
                    </div>
                  ))}
                  
                  <div className="grand-total">
                    <span>Total</span>
                    <span>{orderData?.orderSummary?.total.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Moved the payment button here */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn-primary-xl payment-submit-btn"
                >
                  {isProcessing ? (
                    <>
                      <div className="loader-spinner"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      Payer {orderData?.orderSummary?.total.toFixed(2)}€
                      <Lock size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;