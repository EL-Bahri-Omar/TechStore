import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Heart } from 'lucide-react';
import StarRating from './StarRating';
import ProductCard from '../product/ProductCard';
import { AlertMessages } from '../../utils/alertMessages';
import { getProductDetails } from '../../actions/productActions';
import { addToCart } from '../../actions/cartActions';
import { toggleFavorite, checkFavorite } from '../../actions/favoritesActions';
import { success, warning, info, error } from '../../actions/alertActions';

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { product, loading } = useSelector(state => state.productDetails);
  const { products } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedFavorite, setHasCheckedFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      
      // Check if product is in favorites when product loads
      if (user && product && !hasCheckedFavorite) {
        checkIfFavorite();
        setHasCheckedFavorite(true);
      }
    }
    window.scrollTo(0, 0);
  }, [product, user, hasCheckedFavorite]);

  // Check if product is in favorites
  const checkIfFavorite = async () => {
    try {
      const result = await dispatch(checkFavorite(product._id));
      if (result.success) {
        setIsFavorite(result.isFavorite);
      }
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  // Get similar products
  const similarProducts = products
    ?.filter(p => p.category === product?.category && (p._id || p.id) !== (product?._id || product?.id))
    .slice(0, 4) || [];

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock === 0) {
      dispatch(warning(AlertMessages.OUT_OF_STOCK));
      return;
    }

    if (quantity > product.stock) {
      dispatch(warning(`Seulement ${product.stock} unité(s) disponible(s)`));
      setQuantity(product.stock);
      return;
    }

    dispatch(addToCart(product, quantity));
    dispatch(success(AlertMessages.ADD_TO_CART_SUCCESS));
  };

  const handleWishlistClick = async () => {
    if (!user) {
      dispatch(info(AlertMessages.FAVORITES_LOGIN_REQUIRED));
      return;
    }

    if (!product?._id) {
      dispatch(error('Produit non trouvé'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(toggleFavorite(product._id));
      if (result.success) {
        setIsFavorite(result.isFavorite);
        dispatch(success(result.message));
      } else {
        dispatch(error(result.error));
      }
    } catch (err) {
      dispatch(error('Erreur lors de la modification des favoris'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (!product) return;
    
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) {
      dispatch(warning(`Stock limité: ${product.stock} unité(s) maximum`));
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

  const handleBack = () => {
    navigate(-1);
  };

  const productImages = product?.images || [];
  const mainImage = productImages[selectedImage] || {};
  const imageUrl = mainImage.url || mainImage || '/images/placeholder.jpg';

  // Loading 
  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">Chargement du produit...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Produit non trouvé</h2>
            <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
            <button onClick={handleBack} className="btn btn-primary">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={handleBack} className="back-btn">
          <ChevronLeft size={20} />
          Retour
        </button>

        <div className="product-detail-card">
          <div className="product-detail-grid">
            {/* Images */}
            <div className="product-images">
              <div className="main-image">
                <img
                  src={imageUrl}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              
              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="image-thumbnails">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                    >
                      <img 
                        src={img.url || img} 
                        alt={`${product.name} ${idx + 1}`}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
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
                <StarRating rating={product.rating || 0} size={20} />
                <span>({product.reviews?.length || 0} avis)</span>
              </div>

              <div className="price-large">
                {product.price} €
              </div>

              <div className="stock-status">
                <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                  {product.stock > 10 ? 'En stock' : 
                   product.stock > 0 ? `Seulement ${product.stock} restant(s)` : 'Rupture de stock'}
                </span>
                {product.stock === 0 && (
                  <p className="field-error mt-2">
                    <span className="field-error-icon">⚠</span>
                    Ce produit est temporairement indisponible
                  </p>
                )}
              </div>

              <p className="product-description">{product.description}</p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="features-section">
                  <h3>Caractéristiques :</h3>
                  <ul className="features-list">
                    {product.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

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
                  className="btn btn-primary add-to-cart-btn"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>
              </div>

              {/* Additional Info */}
              <div className="additional-info">
                <div className="info-item">
                  <strong>Catégorie:</strong> {product.category}
                </div>
                <div className="info-item">
                  <strong>Référence:</strong> {product._id}
                </div>
              </div>

              {/* Reviews */}
              <div className="reviews-section">
                <h3>Avis clients ({product.reviews?.length || 0})</h3>
                <div className="reviews-list">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, idx) => (
                      <div key={idx} className="review-item">
                        <div className="review-header">
                          <span className="review-user">{review.name || review.user || 'Utilisateur'}</span>
                          <StarRating rating={review.rating} size={14} />
                          <span className="review-date">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                          </span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">Aucun avis pour ce produit pour le moment.</p>
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
                  key={p._id || p.id}
                  product={p}
                  onViewDetails={() => navigate(`/product/${p._id || p.id}`)}
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