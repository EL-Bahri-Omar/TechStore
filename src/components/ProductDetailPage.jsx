import React, { useState } from 'react';
import { ChevronLeft, Plus, Minus, Heart } from 'lucide-react';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { AlertMessages } from '../utils/alertMessages';

const ProductDetailPage = ({ product, onBack, products, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user, addToFavorites, isProductInFavorites } = useAuth();
  const { success, error: showError, info, warning } = useAlert();
  
  const [isFavorite, setIsFavorite] = useState(isProductInFavorites(product?.id));
  const [isLoading, setIsLoading] = useState(false);

  if (!product) return null;

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      warning(AlertMessages.OUT_OF_STOCK);
      return;
    }

    if (quantity > product.stock) {
      warning(`Seulement ${product.stock} unité(s) disponible(s)`);
      setQuantity(product.stock);
      return;
    }

    addToCart(product, quantity);
    success(AlertMessages.ADD_TO_CART_SUCCESS);
  };

  const handleWishlistClick = async () => {
    if (!user) {
      info(AlertMessages.FAVORITES_LOGIN_REQUIRED);
      return;
    }

    setIsLoading(true);
    const result = await addToFavorites(product.id);
    if (result.success) {
      setIsFavorite(result.isFavorite);
      success(result.message);
    } else {
      showError(result.error);
    }
    setIsLoading(false);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) {
      warning(`Stock limité: ${product.stock} unité(s) maximum`);
      setQuantity(product.stock);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(quantity - 1);
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
                {product.stock === 0 && (
                  <p className="field-error mt-2">
                    <span className="field-error-icon">⚠</span>
                    Ce produit est temporairement indisponible
                  </p>
                )}
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
                    onClick={handleDecrement}
                    className="quantity-btn"
                    disabled={quantity <= 1 || product.stock === 0}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="quantity-btn"
                    disabled={quantity >= product.stock || product.stock === 0}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>
              </div>

              {/* Reviews */}
              <div className="reviews-section">
                <h3>Avis clients ({product.reviews.length})</h3>
                <div className="reviews-list">
                  {product.reviews.length > 0 ? (
                    product.reviews.map((review, idx) => (
                      <div key={idx} className="review-item">
                        <div className="review-header">
                          <span className="review-user">{review.user}</span>
                          <StarRating rating={review.rating} size={14} />
                          <span className="review-date">{review.date}</span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Aucun avis pour ce produit pour le moment.</p>
                  )}
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