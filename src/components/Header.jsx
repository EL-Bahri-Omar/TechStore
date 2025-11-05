import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CategoriesNav from './CategoriesNav';
import techStoreLogo from '../assets/techstore.png';

const Header = ({ onNavigate, currentPage, searchQuery, onSearchChange, selectedCategory, onCategoryChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();

  const cartItemsCount = getCartItemsCount();




  const handleLogoClick = () => {
    onNavigate('home');
  };


  // Pages where CategoriesNav should be shown
  const showCategoriesNav = ['home', 'product'].includes(currentPage);

  return (
    <header className="header">
      {/* Main Header */}
      <div className="container">
        <div className="header-content">
          
          {/* Logo cliquable */}
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
          
          {/* Search Bar in Header */}
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
            
            
              <button
                onClick={() => onNavigate('login')}
                className="login-icon"
              >
                <User size={26} />
              </button>
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
            
          </div>
        )}
      </div>

      {/* Categories Navbar - shown only on specific pages */}
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