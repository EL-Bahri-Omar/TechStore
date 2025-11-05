import React, { useState, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import ProfilePage from "./components/ProfilePage";
import OrdersPage from "./components/OrdersPage";
import CheckoutPage from './components/CheckoutPage';
import PaymentPage from './components/PaymentPage';
import ConfirmationPage from './components/ConfirmationPage';
import './App.css';

const ECommerceApp = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch products from db.json
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleNavigate = (page, productId = null) => {
    setCurrentPage(page);
    setSelectedProductId(productId);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // If we're not on home page, navigate to home with the selected category
    if (currentPage !== 'home') {
      handleNavigate('home');
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            products={products}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        );
      
      case 'product':
        return (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate(-1)}
            products={products}
          />
        );
      
      case 'cart':
        return (
          <CartPage
            onNavigate={handleNavigate}
          />
        );
      
      case 'login':
        return (
          <LoginPage
            onNavigate={handleNavigate}
          />
        );
      
      case 'profile':
        return (
          <ProfilePage
            onNavigate={handleNavigate}
          />
        );
      
      case 'orders':
        return (
          <OrdersPage
            onNavigate={handleNavigate}
          />
        );
      
      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={handleNavigate}
          />
        );
      
      case 'payment':
        return (
          <PaymentPage
            onNavigate={handleNavigate}
            orderData={selectedProductId}
          />
        );
      
      case 'confirmation':
        return (
          <ConfirmationPage
            onNavigate={handleNavigate}
            orderId={selectedProductId}
          />
        );
      
      default:
        return (
          <HomePage
            products={products}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Header
            onNavigate={handleNavigate}
            currentPage={currentPage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <main>
            {renderCurrentPage()}
          </main>

          {/* Footer */}
          <footer className="footer">
            <div className="container text-center">
              <p>© 2025 TechStore - Tous droits réservés</p>
              <p>Application e-commerce moderne et responsive</p>
            </div>
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default ECommerceApp;