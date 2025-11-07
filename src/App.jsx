import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import OrdersPage from './components/OrdersPage';
import FavoritesPage from './components/FavoritesPage';
import AddressesPage from './components/AddressesPage';
import CheckoutPage from './components/CheckoutPage';
import PaymentPage from './components/PaymentPage';
import ConfirmationPage from './components/ConfirmationPage';
import { getProducts } from './services/firebaseService';
import './App.css';

// Main App Component with Routing
const ECommerceApp = () => {
  return (
    <Router>
      <AlertProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </AlertProvider>
    </Router>
  );
};

const AppContent = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderData, setOrderData] = useState(null); // Add state for order data
  
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products from Firebase:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleNavigate = (page, data = null) => {
    let path = '';
    
    switch (page) {
      case 'home':
        path = 'home';
        break;
      case 'product':
        path = `/product/${data}`;
        break;
      case 'cart':
        path = '/cart';
        break;
      case 'login':
        path = '/login';
        break;
      case 'profile':
        path = '/profile';
        break;
      case 'orders':
        path = '/orders';
        break;
      case 'favorites':
        path = '/favorites';
        break;
      case 'addresses':
        path = '/addresses';
        break;
      case 'checkout':
        path = '/checkout';
        break;
      case 'payment':
        path = '/payment';
        if (data) {
          setOrderData(data);
        }
        break;
      case 'confirmation':
        path = `/confirmation/${data}`; 
        break;
      case -1:
        navigate(-1);
        return;
      default:
        path = 'home';
    }
    
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (location.pathname !== 'home') {
      handleNavigate('home');
    }
  };

  // Get current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === 'home') return 'home';
    if (path.startsWith('/product/')) return 'product';
    if (path === '/cart') return 'cart';
    if (path === '/login') return 'login';
    if (path === '/profile') return 'profile';
    if (path === '/orders') return 'orders';
    if (path === '/favorites') return 'favorites';
    if (path === '/addresses') return 'addresses';
    if (path === '/checkout') return 'checkout';
    if (path === '/payment') return 'payment';
    if (path.startsWith('/confirmation/')) return 'confirmation';
    return 'home';
  };

  // Get product ID from URL for product detail and confirmation pages
  const getSelectedProductId = () => {
    const path = location.pathname;
    if (path.startsWith('/product/')) {
      return path.split('/product/')[1];
    }
    if (path.startsWith('/confirmation/')) {
      return path.split('/confirmation/')[1];
    }
    return null;
  };

  const currentPage = getCurrentPage();
  const selectedProductId = getSelectedProductId();
  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
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
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                products={products}
                onNavigate={handleNavigate}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            } 
          />
          
          <Route 
            path="/product/:productId" 
            element={
              <ProductDetailPage
                product={selectedProduct}
                onNavigate={handleNavigate}
                onBack={() => handleNavigate(-1)}
                products={products}
              />
            } 
          />
          
          <Route 
            path="/cart" 
            element={
              <CartPage
                onNavigate={handleNavigate}
              />
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <LoginPage
                onNavigate={handleNavigate}
              />
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProfilePage
                onNavigate={handleNavigate}
              />
            } 
          />
          
          <Route 
            path="/orders" 
            element={
              <OrdersPage
                onNavigate={handleNavigate}
              />
            } 
          />
          
          <Route 
            path="/favorites" 
            element={
              <FavoritesPage
                onNavigate={handleNavigate}
              />
            } 
          />
          
          <Route 
            path="/addresses" 
            element={
              <AddressesPage
                onNavigate={handleNavigate}
              />
            } 
          />
          
          <Route 
            path="/checkout" 
            element={
              <CheckoutPage
                onNavigate={handleNavigate}
              />
            } 
          />
          
          <Route 
            path="/payment" 
            element={
              <PaymentPage
                onNavigate={handleNavigate}
                orderData={orderData}
              />
            } 
          />
          
          <Route 
            path="/confirmation/:orderId" 
            element={
              <ConfirmationPage
                onNavigate={handleNavigate}
                orderId={selectedProductId}
              />
            } 
          />
          
          <Route 
            path="*" 
            element={
              <HomePage
                products={products}
                onNavigate={handleNavigate}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container text-center">
          <p>© 2025 TechStore - Tous droits réservés</p>
          <p>Application e-commerce moderne et responsive</p>
        </div>
      </footer>
    </div>
  );
};

export default ECommerceApp;