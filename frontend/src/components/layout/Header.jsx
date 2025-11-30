import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CategoriesNav from './CategoriesNav';
import techStoreLogo from '../assets/techstore.png';

const Header = ({ onNavigate, currentPage, searchQuery, onSearchChange, selectedCategory, onCategoryChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  const cartItemsCount = getCartItemsCount();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setUserDropdownOpen(false);
  };

  const handleLogoClick = () => {
    onNavigate('home');
  };

  const userInitials = user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : '';

  const showCategoriesNav = ['home', 'product'].includes(currentPage);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          
          <div 
            onClick={handleLogoClick}
            className="header-logo-container"
          >
            <img
              className="header-logo"
              src={techStoreLogo}
              alt="TechStore Logo"
            />
          </div>
          
          <div className="header-search">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="header-form-input search-input"
              />
            </div>
          </div>

          <div className="header-actions">
            <button
              onClick={() => onNavigate('cart')}
              className="cart-icon"
            >
              <ShoppingCart size={26} />
              {cartItemsCount > 0 && (
                <span className="cart-badge">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="user-dropdown-container" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="user-profile-btn"
                >
                  <div className="user-avatar">
                    {userInitials}
                  </div>
                  <span className="user-name">
                    {user.firstName}
                  </span>
                  <ChevronDown size={16} className={`dropdown-arrow ${userDropdownOpen ? 'dropdown-arrow-open' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-avatar user-avatar-large">
                        {userInitials}
                      </div>
                      <div className="user-info">
                        <p className="user-fullname">{user.firstName} {user.lastName}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider" />
                    
                    <button
                      onClick={() => { onNavigate('profile'); setUserDropdownOpen(false); }}
                      className="dropdown-item"
                    >
                      Mon profil
                    </button>
                    
                    <button
                      onClick={() => { onNavigate('orders'); setUserDropdownOpen(false); }}
                      className="dropdown-item"
                    >
                      Mes commandes
                    </button>
                    
                    <button
                      onClick={() => { onNavigate('favorites'); setUserDropdownOpen(false); }}
                      className="dropdown-item"
                    >
                      Mes favoris
                    </button>
                    
                    <button
                      onClick={() => { onNavigate('addresses'); setUserDropdownOpen(false); }}
                      className="dropdown-item"
                    >
                      Mes adresses
                    </button>
                    
                    <div className="dropdown-divider" />
                    
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-btn"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="login-icon"
              >
                <User size={26} />
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="mobile-menu-item"
            >
              Accueil
            </button>
            {user && (
              <>
                <button
                  onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
                  className="mobile-menu-item"
                >
                  Mon profil
                </button>
                <button
                  onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}
                  className="mobile-menu-item"
                >
                  Mes commandes
                </button>
                <button
                  onClick={handleLogout}
                  className="mobile-menu-item"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {showCategoriesNav && (
        <CategoriesNav 
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      )}
    </header>
  );
};

export default Header;