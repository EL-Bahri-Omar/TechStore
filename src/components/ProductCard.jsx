import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useAlert } from '../contexts/AlertContext';
import { AlertMessages } from '../utils/alertMessages';

const ProductCard = ({ product, onViewDetails }) => {
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { user, addToFavorites, isProductInFavorites } = useAuth();
  const { addToCart } = useCart();
  const { success, error: showError, info, warning } = useAlert();

  const isFavorite = isProductInFavorites(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (product.stock === 0) {
      warning(AlertMessages.OUT_OF_STOCK);
      return;
    }

    addToCart(product, 1);
    success(AlertMessages.ADD_TO_CART_SUCCESS);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      info(AlertMessages.FAVORITES_LOGIN_REQUIRED);
      return;
    }

    setIsWishlistLoading(true);
    const result = await addToFavorites(product.id);
    
    if (result.success) {
      success(result.message);
    } else {
      showError(result.error);
    }
    
    setIsWishlistLoading(false);
  };

  return (
    <div className="product-card" onClick={onViewDetails}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <button
          onClick={handleWishlistToggle}
          className={`wishlist-btn ${isFavorite ? 'active' : ''} ${isWishlistLoading ? 'loading' : ''}`}
          disabled={isWishlistLoading}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        {product.stock === 0 && (
          <div className="out-of-stock-badge">
            Rupture de stock
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        
        <div className="rating-container">
          <div className="star-rating">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-text">({product.reviewCount})</span>
        </div>

        <div className="product-details">
          <span className="product-price">{product.price}€</span>
          <span className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
          </span>
        </div>

        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;