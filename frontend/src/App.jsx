import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { loadUser } from './actions/userActions';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/route/ProtectedRoute';
import Loader from './components/layout/Loader';

// Import pages
import HomePage from './components/pages/HomePage';
import ProductDetailPage from './components/product/ProductDetailPage';
import LoginPage from './components/user/LoginPage';
import RegisterPage from './components/user/RegisterPage';
import ProfilePage from './components/user/ProfilePage';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/order/CheckoutPage';
import PaymentPage from './components/order/PaymentPage';
import ConfirmationPage from './components/order/ConfirmationPage';
import OrdersPage from './components/user/OrdersPage';
import FavoritesPage from './components/user/FavoritesPage';
import AddressesPage from './components/user/AddressesPage';
import Alert from "./components/layout/Alert";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('popularity');

  // ALWAYS load user on app start
  useEffect(() => {
    console.log('🔄 App starting - loading user...');
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    
    // Parse URL parameters for home page
    if (location.pathname === '/') {
      const urlParams = new URLSearchParams(location.search);
      
      // Get search query
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchQuery(decodeURIComponent(searchParam));
      } else {
        setSearchQuery('');
      }
      
      // Get category
      const categoryParam = urlParams.get('category');
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      } else {
        setSelectedCategory('all');
      }
      
      // Get page number
      const pageParam = urlParams.get('page');
      if (pageParam && !isNaN(pageParam) && pageParam > 0) {
        setCurrentPage(parseInt(pageParam));
      } else {
        setCurrentPage(1);
      }

      // Get price range
      const priceGte = urlParams.get('price[gte]');
      const priceLte = urlParams.get('price[lte]');
      if (priceGte && priceLte) {
        setPriceRange([parseInt(priceGte), parseInt(priceLte)]);
      } else {
        setPriceRange([0, 2000]);
      }

      // Get sort
      const sortParam = urlParams.get('sort');
      if (sortParam) {
        switch(sortParam) {
          case 'price':
            setSortBy('price-asc');
            break;
          case '-price':
            setSortBy('price-desc');
            break;
          case '-rating':
            setSortBy('rating');
            break;
          default:
            setSortBy('popularity');
        }
      } else {
        setSortBy('popularity');
      }
    }
  }, [location]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    updateURL({ search: query, page: 1 });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateURL({ category, page: 1 });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL({ page });
    window.scrollTo(0, 0);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    updateURL({ priceRange: range, page: 1 });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    updateURL({ sort, page: 1 });
  };

  // Clear all filters
  const clearFilters = () => {    
    setSearchQuery('');
    setSelectedCategory('all');
    setCurrentPage(1);
    setPriceRange([0, 2000]);
    setSortBy('popularity');
    
    navigate('/', { replace: true });
  };

  const updateURL = (params) => {
    const urlParams = new URLSearchParams();
    
    // Create merged filters with current state and new params
    const mergedFilters = {
      search: params.search !== undefined ? params.search : searchQuery,
      category: params.category !== undefined ? params.category : selectedCategory,
      page: params.page !== undefined ? params.page : currentPage,
      'price[gte]': params.priceRange ? params.priceRange[0] : priceRange[0],
      'price[lte]': params.priceRange ? params.priceRange[1] : priceRange[1],
      sort: params.sort !== undefined ? params.sort : sortBy
    };

    const getBackendSort = (frontendSort) => {
      switch(frontendSort) {
        case 'price-asc':
          return 'price';
        case 'price-desc':
          return '-price';
        case 'rating':
          return '-rating';
        default:
          return '-createdAt';
      }
    };

    
    // Search 
    if (mergedFilters.search && mergedFilters.search !== '') {
      urlParams.set('search', encodeURIComponent(mergedFilters.search));
    }
    
    // Category
    if (mergedFilters.category && mergedFilters.category !== 'all') {
      urlParams.set('category', mergedFilters.category);
    }
    
    if (mergedFilters.page && mergedFilters.page > 1) {
      urlParams.set('page', mergedFilters.page);
    }
    
    // Price range
    if (mergedFilters['price[gte]'] > 0 || mergedFilters['price[lte]'] < 2000) {
      urlParams.set('price[gte]', mergedFilters['price[gte]']);
      urlParams.set('price[lte]', mergedFilters['price[lte]']);
    }
    
    // Sort
    const backendSort = getBackendSort(mergedFilters.sort);
    if (backendSort !== '-createdAt') {
      urlParams.set('sort', backendSort);
    }
    
    const queryString = urlParams.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';
    
    console.log('🔗 Navigating to clean URL:', newUrl);
    navigate(newUrl, { replace: true });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <main className="main-content">
        <Alert/>
        <Routes>
          <Route path="/" element={
            <HomePage 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onClearFilters={clearFilters} // ADD THIS PROP
            />
          } />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* Protected Routes */}
          <Route path="/me" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />
          <Route path="/confirmation" element={
            <ProtectedRoute>
              <ConfirmationPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          } />

          {/* 404 Page */}
          <Route path="*" element={
            <div className="container py-16 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
              <a href="/" className="btn btn-primary">
                Retour à l'accueil
              </a>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;