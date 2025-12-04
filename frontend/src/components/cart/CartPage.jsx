import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Add this import
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { AlertMessages } from '../../utils/alertMessages';
import { addToCart, removeFromCart, updateCartItem, clearCart } from '../../actions/cartActions';
import { success, error } from '../../actions/alertActions';

const CartPage = () => { 
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add useNavigate hook
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const handleUpdateQuantity = (product, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(product.id));
      dispatch(success(AlertMessages.REMOVE_FROM_CART_SUCCESS));
    } else {
      dispatch(updateCartItem(product.id, newQuantity));
      dispatch(success(AlertMessages.CART_UPDATE_SUCCESS));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    dispatch(success(AlertMessages.REMOVE_FROM_CART_SUCCESS));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(success(AlertMessages.CART_CLEAR_SUCCESS));
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      dispatch(error(AlertMessages.CART_EMPTY_ERROR));
      return;
    }
    navigate('/checkout');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <ShoppingCart size={64} />
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits à votre panier pour continuer vos achats.</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 4.99;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title mb-8">Mon Panier</h1>
        
        <div className="cart-layout">
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={`cart-item-${item.id}`} className="cart-item">
                <div className="cart-item-content">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">{item.price} €</p>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="remove-btn"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <p>{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="cart-actions">
              <button
                onClick={handleClearCart}
                className="clear-cart-btn"
              >
                <Trash2 size={16} />
                Vider le panier
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Résumé de la commande</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Sous-total ({getCartItemsCount()} articles)</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="summary-row">
                  <span>Livraison</span>
                  <span>{shipping.toFixed(2)} €</span>
                </div>
                <div className="summary-row">
                  <span>TVA (20%)</span>
                  <span>{tax.toFixed(2)} €</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="checkout-btn"
              >
                Procéder au paiement
                <ArrowRight size={20} />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="continue-shopping-btn"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;