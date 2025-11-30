import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from './ProductCard';
import { getUserWishlist } from '../services/firebaseService';

const FavoritesPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!user) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const favorites = await getUserWishlist(user.id);
        setFavoriteProducts(favorites);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [user]);

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Veuillez vous connecter pour voir vos favoris.</p>
          <button onClick={() => onNavigate('login')} className="btn btn-primary mt-4">
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
        
        {favoriteProducts.length > 0 ? (
          <div>
            <div className="favorites-count mb-6">
              <p>
                {favoriteProducts.length} produit(s) favori(s)
              </p>
            </div>
            
            <div className="favorites-grid">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={() => onNavigate('product', product.id)}
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
                onClick={() => onNavigate('home')} 
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