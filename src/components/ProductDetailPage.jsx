import React, { useState } from 'react';
import { ChevronLeft, Plus, Minus, Heart } from 'lucide-react';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetailPage = ({ product, onBack, products, onNavigate}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user, addToFavorites, isProductInFavorites } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isProductInFavorites(product?.id));
  const [isLoading, setIsLoading] = useState(false);

  if (!product) return null;

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistClick = async () => {
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

  return (
    <div className="product-detail-page">
      <div className="container">
        <button
          onClick={onBack}
          className="back-btn"
        >
          <ChevronLeft size={20} />
          Retour
        </button>

        <div className="product-detail-card">
          <div className="product-detail-grid">
            {/* Images */}
            <div className="product-images">
              <div className="main-image">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                />
              </div>
              <div className="image-thumbnails">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="product-info">
              <div className="product-header">
                <h1>{product.name}</h1>
                <button 
                  className={`wishlist-btn-header ${isFavorite ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                  onClick={handleWishlistClick}
                  disabled={isLoading}
                  title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <div className="rating-section">
                <StarRating rating={product.rating} size={20} />
                <span>({product.reviews.length} avis)</span>
              </div>

              <div className="price-large">
                {product.price}€
              </div>

              <div className="stock-status">
                <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                  {product.stock > 10 ? 'En stock' : `Seulement ${product.stock} restant(s)`}
                </span>
              </div>

              <p className="product-description">{product.description}</p>

              <div className="features-section">
                <h3>Caractéristiques :</h3>
                <ul className="features-list">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="add-to-cart-section">
                <div className="quantity-control">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="quantity-btn"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary add-to-cart-btn"
                >
                  Ajouter au panier
                </button>
              </div>

              {/* Reviews */}
              <div className="reviews-section">
                <h3>Avis clients</h3>
                <div className="reviews-list">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="review-item">
                      <div className="review-header">
                        <span className="review-user">{review.user}</span>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="similar-products">
            <h2>Produits similaires</h2>
            <div className="similar-products-grid">
              {similarProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onViewDetails={() => onNavigate('product', p.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;