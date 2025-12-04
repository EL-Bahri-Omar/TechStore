import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, ChevronDown, Menu, X } from 'lucide-react';
import CategoriesNav from './CategoriesNav';
import techStoreLogo from '../../assets/techstore.png';
import { logout } from '../../actions/userActions';

const Header = ({ searchQuery, onSearchChange, selectedCategory, onCategoryChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dropdownRef = useRef(null);

  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const cartItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setUserDropdownOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    onSearchChange('');
    window.scrollTo(0, 0);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setUserDropdownOpen(false);
  };

  const handleSearchChange = (query) => {
    onSearchChange(query); 
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    closeSidebar();
  };

  const userInitials = user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : '';

  const currentPath = window.location.pathname;
  const showCategoriesNav = currentPath === '/' || currentPath.includes('/product');

  // Show toggle for screens < 769px (mobile + tablet)
  const showSidebarToggle = windowWidth < 769;
  
  // Show desktop navbar for screens ≥ 769px
  const showDesktopNavbar = windowWidth >= 769;

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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="header-form-input search-input"
              />
            </div>
          </div>

          <div className="header-actions">
            <button
              onClick={() => handleNavigation('/cart')}
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
                      onClick={() => handleNavigation('/me')}
                      className="dropdown-item"
                    >
                      Mon profil
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('/orders')}
                      className="dropdown-item"
                    >
                      Mes commandes
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('/favorites')}
                      className="dropdown-item"
                    >
                      Mes favoris
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('/addresses')}
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
                onClick={() => handleNavigation('/login')}
                className="login-icon"
              >
                <User size={26} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Navigation - Desktop (for screens ≥ 769px) */}
      {showCategoriesNav && showDesktopNavbar && (
        <div className="categories-navbar">
          <CategoriesNav 
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      )}
      
      {/* Mobile/Tablet Sidebar Toggle (only for screens < 769px) */}
      {showCategoriesNav && showSidebarToggle && (
        <div className="categories-sidebar-container">
          <button 
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Open categories menu"
          >
            <Menu size={24} />
          </button>

          <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar} />

          <div className={`categories-sidebar ${sidebarOpen ? 'active' : ''}`}>
            <div className="sidebar-header">
              <h3 className="sidebar-title">Catégories</h3>
              <button className="sidebar-close-btn" onClick={closeSidebar}>
                <X size={20} />
              </button>
            </div>

            <CategoriesNav 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategorySelect}
              isSidebar={true}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;