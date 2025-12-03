import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { getUserFavorites } from '../../actions/favoritesActions';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth);
  const { favorites, loading } = useSelector(state => state.favorites);

  useEffect(() => {
    if (user) {
      dispatch(getUserFavorites());
    }
  }, [dispatch, user]);

  const getProductKey = (product, index) => {
    const productId = product._id || product.id;
    if (!productId) {
      return `fav-${index}-${Date.now()}`;
    }
    return `fav-${productId}`;
  };

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Veuillez vous connecter pour voir vos favoris.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary mt-4">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="favorites-container">
        <h1 className="page-title mb-8">Mes favoris</h1>
        
        {favorites.length > 0 ? (
          <div>
            <div className="favorites-count mb-6">
              <p>{favorites.length} produit(s) favori(s)</p>
            </div>
            
            <div className="favorites-grid">
              {favorites.map((product, index) => (
                <ProductCard
                  key={getProductKey(product, index)}
                  product={product}
                  onViewDetails={() => navigate(`/product/${product._id || product.id}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-favorites">
            <div className="empty-favorites-content">
              <div className="empty-favorites-icon">❤️</div>
              <h3>Aucun favori pour le moment</h3>
              <p>
                Ajoutez des produits à vos favoris en cliquant sur l'icône cœur 
                pour les retrouver facilement plus tard.
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-primary"
              >
                Découvrir nos produits
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;