import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Range } from 'react-range';
import ProductCard from '../product/ProductCard';
import { getProducts } from '../../actions/productActions';

const HomePage = ({ 
  searchQuery, 
  selectedCategory, 
  onCategoryChange,
  currentPage,
  onPageChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onClearFilters
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const { products, loading, resPerPage, filteredProductsCount } = useSelector(state => state.products);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Load products when filters, search, or page changes
  useEffect(() => {
    console.log('HomePage: Dispatching getProducts with:', {
      searchQuery, selectedCategory, currentPage, priceRange, sortBy
    });
    dispatch(getProducts(searchQuery, selectedCategory, currentPage, priceRange, sortBy));
  }, [dispatch, searchQuery, selectedCategory, currentPage, priceRange, sortBy]);

  // Set featured products (first 7 products for carousel)
  useEffect(() => {
    if (products && products.length > 0 && currentPage === 1 && !searchQuery && selectedCategory === 'all') {
      setFeaturedProducts(products.slice(0, 7));
      setLoadingFeatured(false);
    } else {
      setFeaturedProducts([]);
      setLoadingFeatured(false);
    }
  }, [products, currentPage, searchQuery, selectedCategory]);

  const isFilterActive = selectedCategory !== 'all' || 
                         priceRange[0] > 0 || 
                         priceRange[1] < 2000 || 
                         sortBy !== 'popularity' || 
                         searchQuery;

  // Carousel auto-slide - only when no filters active
  useEffect(() => {
    if (!isFilterActive && featuredProducts.length > 0 && !loadingFeatured && currentPage === 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredProducts.length, isFilterActive, loadingFeatured, currentPage]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleCarouselClick = () => {
    const currentProduct = featuredProducts[currentSlide];
    if (currentProduct) {
      navigate(`/product/${currentProduct._id || currentProduct.id}`);
    }
  };

  const categories = [
    'all',
    'Informatique',
    'Téléphonie & Tablette',
    'Stockage',
    'Impression',
    'Audio',
    'Accessoires',
    'Photo',
    'Télévision'
  ];

  const categoryNames = {
    all: 'Toutes les catégories',
    Informatique: 'Informatique',
    'Téléphonie & Tablette': 'Téléphonie & Tablette',
    Stockage: 'Stockage',
    Impression: 'Impression',
    Audio: 'Audio',
    Accessoires: 'Accessoires',
    Photo: 'Photo',
    Télévision: 'Télévision'
  };

  // pagination info
  const totalPages = Math.ceil(filteredProductsCount / resPerPage) || 1;

  const clearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      onCategoryChange('all');
      onPriceRangeChange([0, 2000]);
      onSortChange('popularity');
    }
    setCurrentSlide(0);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle filter changes 
  const handleCategoryChange = (category) => {
    onCategoryChange(category);
  };

  const handlePriceRangeChange = (range) => {
    onPriceRangeChange(range);
  };

  const handleSortChange = (sort) => {
    onSortChange(sort);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        endPage = 4;
      }
      
      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== '...') {
      onPageChange(page);
    }
  };

  return (
    <div className="home-page">
      {/* Carousel */}
      {!isFilterActive && currentPage === 1 && featuredProducts.length > 0 && !loadingFeatured && (
        <div className="carousel-container">
          <div className="carousel">
            {featuredProducts.map((product, index) => (
              <div
                key={`carousel-slide-${product._id || index}`}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="carousel-content" onClick={handleCarouselClick}>
                  <img src={product.images[0].url} alt={product.name} className="carousel-image" />
                  <div className="carousel-text">
                    <h2>{product.name}</h2>
                    <p>{product.price} €</p>
                    <button className="carousel-view-btn">Voir le produit</button>
                  </div>
                </div>
              </div>
            ))}

            <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
              <ChevronLeft size={32} />
            </button>

            <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
              <ChevronRight size={32} />
            </button>

            <div className="carousel-indicators">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container py-12">
        <div className="products-section">
          <div className="filters-header">
            <div className="filters-right">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="filters-toggle-btn"
              >
                <Filter size={16} />
                Filtres {showFilters ? '▲' : '▼'}
              </button>
            </div>

            <div className="filters-left">
              <h2 className="section-title">
                {isFilterActive ? 'Résultats de la recherche' : 'Tous les Produits'}
              </h2>
              <span className="results-count">
                {filteredProductsCount} produit(s) trouvé(s)
                {totalPages > 1 && ` - Page ${currentPage} sur ${totalPages}`}
              </span>
              {isFilterActive && (
                <button onClick={clearFilters} className="btn btn-secondary clear-filters-header-btn">
                  Afficher tous les produits
                </button>
              )}
            </div>
          </div>

          <div className="home-catalog-layout">
            {showFilters && (
              <div className="filters-sidebar">
                <div className="filters-card">
                  <h3 className="filters-title">
                    <Filter size={20} />
                    Filtres
                  </h3>

                  {/* Categories Filter */}
                  <div className="filter-section">
                    <h4>Catégories</h4>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`filter-category ${selectedCategory === cat ? 'active' : ''}`}
                      >
                        {categoryNames[cat]}
                      </button>
                    ))}
                  </div>

                  {/* Price Range Filter */}
                  <div className="filter-section">
                    <h4>Prix</h4>
                    <div className="price-filter">
                      <Range
                        step={1}
                        min={0}
                        max={2000}
                        values={priceRange}
                        onChange={handlePriceRangeChange}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            className="track"
                            style={{
                              ...props.style,
                              background: `linear-gradient(to right, #d1d5db ${(priceRange[0] / 2000) * 100}%, #3b82f6 ${(priceRange[0] / 2000) * 100}%, #3b82f6 ${(priceRange[1] / 2000) * 100}%, #d1d5db ${(priceRange[1] / 2000) * 100}%)`,
                            }}
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props, isDragged }) => (
                          <div
                            {...props}
                            className="thumb"
                            style={{
                              ...props.style,
                              backgroundColor: isDragged ? '#3b82f6' : '#fff',
                              border: '2px solid #3b82f6',
                            }}
                          />
                        )}
                      />
                      <div className="price-values">
                        <span>{priceRange[0]} €</span>
                        <span>{priceRange[1]} €</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="sort-dropdown"
                  >
                    <option value="popularity">Popularité</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="rating">Meilleures notes</option>
                  </select>

                  <button onClick={clearFilters} className="btn btn-secondary clear-filters-btn">
                    Effacer les filtres
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className={`products-grid-section ${showFilters ? 'with-filters' : ''}`}>
              {loading ? (
                <div className="loading-container">
                  <div className="loader-spinner"></div>
                  <p>Chargement des produits...</p>
                </div>
              ) : (
                <>
                  <div className="products-grid">
                    {products && products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onViewDetails={() => handleViewDetails(product._id)}
                      />
                    ))}
                  </div>

                  {(!products || products.length === 0) && (
                    <div className="no-results">
                      <p>Aucun produit trouvé avec les critères sélectionnés.</p>
                      <button onClick={clearFilters} className="btn btn-primary">
                        Réinitialiser les filtres
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                      >
                        Précédent
                      </button>
                      
                      {getPageNumbers().map((pageNumber, index) => (
                        pageNumber === '...' ? (
                          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                          >
                            {pageNumber}
                          </button>
                        )
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                      >
                        Suivant
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 