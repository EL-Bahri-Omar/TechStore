import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { AlertMessages } from '../../utils/alertMessages';
import { addToCart } from '../../actions/cartActions';
import { toggleFavorite, checkFavorite } from '../../actions/favoritesActions';
import { success, warning, info, error } from '../../actions/alertActions';

const ProductCard = ({ product, onViewDetails }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasCheckedFavorite, setHasCheckedFavorite] = useState(false);

  const productId = product._id || product.id;

  useEffect(() => {
    if (user && productId && !hasCheckedFavorite) {
      checkIfFavorite();
      setHasCheckedFavorite(true);
    }
  }, [user, productId, hasCheckedFavorite]);

  // Check if product is in favorites
  const checkIfFavorite = async () => {
    try {
      const result = await dispatch(checkFavorite(productId));
      if (result.success) {
        setIsFavorite(result.isFavorite);
      }
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  const productImages = product.images || [];
  const productImage = productImages[0]?.url || productImages[0] || product.image || '/images/placeholder.jpg';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (product.stock === 0) {
      dispatch(warning(AlertMessages.OUT_OF_STOCK));
      return;
    }

    dispatch(addToCart(product, 1));
    dispatch(success(AlertMessages.ADD_TO_CART_SUCCESS));
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      dispatch(info(AlertMessages.FAVORITES_LOGIN_REQUIRED));
      return;
    }

    setIsWishlistLoading(true);
    try {
      const result = await dispatch(toggleFavorite(productId));
      if (result.success) {
        setIsFavorite(result.isFavorite);
        dispatch(success(result.message));
      } else {
        dispatch(error(result.error));
      }
    } catch (err) {
      dispatch(error('Erreur lors de l\'ajout aux favoris'));
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const reviewsCount = product.reviews?.length || 0;

  return (
    <div className="product-card" onClick={onViewDetails}>
      <div className="product-image">
        <img src={productImage} alt={product.name} onError={(e) => {
          e.target.src = '/images/placeholder.jpg';
        }} />
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
                key={`star-${i}-${productId}`}
                className={i < Math.floor(product.rating || 0) ? 'star-filled' : 'star-empty'}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-text">({reviewsCount} avis)</span>
        </div>

        <div className="product-details">
          <span className="product-price">{product.price} €</span>
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