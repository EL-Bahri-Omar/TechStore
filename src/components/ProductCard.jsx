import { Heart } from 'lucide-react';
import StarRating from './StarRating';

const ProductCard = ({ product, onViewDetails }) => {




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
          className="wishlist-btn "
        >
          <Heart size={18}  />
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