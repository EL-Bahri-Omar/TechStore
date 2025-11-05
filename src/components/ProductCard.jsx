import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import StarRating from './StarRating';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { user, addToFavorites, isProductInFavorites } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isProductInFavorites(product.id));
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }

    setIsLoading(true);
    const result = await addToFavorites(product.id);
    if (result.success) {
      setIsFavorite(result.isFavorite);
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  const handleCardClick = () => {
    onViewDetails(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
        />
        <button 
          className={`wishlist-btn ${isFavorite ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
          onClick={handleWishlistClick}
          disabled={isLoading}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-title">
          {product.name}
        </h3>
        <div className="rating-container">
          <StarRating rating={product.rating} size={14} />
          <span className="rating-text">({product.rating})</span>
        </div>
        <div className="product-details">
          <span className="product-price">{product.price}€</span>
          <span className="product-stock">{product.stock} en stock</span>
        </div>
        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            className="btn btn-primary add-to-cart-btn"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;