import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import CategoriesNav from './CategoriesNav';
import techStoreLogo from '../assets/techstore.png';

const Header = ({ onNavigate, currentPage, searchQuery, onSearchChange, selectedCategory, onCategoryChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



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
              
            </button>

            <button
                onClick={() => onNavigate('login')}
                className="login-icon"
              >
                <User size={26} />
              </button>
            
          </div>
        </div>

        
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