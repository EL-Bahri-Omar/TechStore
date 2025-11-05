import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Range } from 'react-range';
import ProductCard from '../components/ProductCard';

const HomePage = ({ products, onNavigate, searchQuery, selectedCategory, onCategoryChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;
  const featuredProducts = products.slice(0, 3);

  // Check if any filter is active
  const isFilterActive = selectedCategory !== 'all' || 
                         priceRange[0] > 0 || 
                         priceRange[1] < 2000 || 
                         sortBy !== 'popularity' || 
                         searchQuery;

  useEffect(() => {
    // Only run carousel timer if no filters are active
    if (!isFilterActive) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredProducts.length, isFilterActive]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleCarouselClick = () => {
    const currentProduct = featuredProducts[currentSlide];
    if (currentProduct) {
      onNavigate('product', currentProduct.id);
    }
  };

  // Filter and sort logic
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedCategory, priceRange, sortBy, searchQuery, products]);

  const categories = [
    'all',
    'informatique',
    'Téléphonie & Tablette',
    'Stockage',
    'impression',
    'Audio',
    'Accessoires',
    'photo',
    'Television'
  ];

  const categoryNames = {
    all: 'Toutes les catégories',
    informatique: 'Informatique',
    'Téléphonie & Tablette': 'Téléphonie & Tablette',
    Stockage: 'Stockage',
    impression: 'Impression',
    Audio: 'Audio',
    Accessoires: 'Accessoires',
    photo: 'Photo',
    Television: 'Télévision'
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const clearFilters = () => {
    onCategoryChange('all');
    setPriceRange([0, 2000]);
    setSortBy('popularity');
    setCurrentSlide(0); // Reset carousel to first slide
  };

  return (
    <div className="home-page">
      {/* Carousel - Only show when no filters are active */}
      {!isFilterActive && (
        <div className="carousel-container">
          <div className="carousel">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="carousel-content" onClick={handleCarouselClick}>
                  <img src={product.image} alt={product.name} className="carousel-image" />
                  <div className="carousel-text">
                    <h2>{product.name}</h2>
                    <p>{product.price} €</p>
                    <button className="carousel-view-btn">Voir le produit</button>
                  </div>
                </div>
              </div>
            ))}

            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
            >
              <ChevronLeft size={32} />
            </button>

            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
            >
              <ChevronRight size={32} />
            </button>

            <div className="carousel-indicators">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
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
              <span className="results-count">{filteredProducts.length} produit(s) trouvé(s)</span>
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
                        onClick={() => onCategoryChange(cat)}
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
                        onChange={setPriceRange}
                        renderTrack={({ props, children }) => {
                          const { key, ...restProps } = props;
                          return (
                            <div
                              key={key}
                              {...restProps}
                              className="track"
                              style={{
                                ...restProps.style,
                                background: `linear-gradient(to right, #d1d5db ${(priceRange[0] / 2000) * 100}%, #3b82f6 ${(priceRange[0] / 2000) * 100}%, #3b82f6 ${(priceRange[1] / 2000) * 100}%, #d1d5db ${(priceRange[1] / 2000) * 100}%)`,
                              }}
                            >
                              {children}
                            </div>
                          );
                        }}
                        renderThumb={({ props, isDragged }) => {
                          const { key, ...restProps } = props;
                          return (
                            <div
                              key={key}
                              {...restProps}
                              className="thumb"
                              style={{
                                ...restProps.style,
                                backgroundColor: isDragged ? '#3b82f6' : '#fff',
                                border: '2px solid #3b82f6',
                              }}
                            />
                          );
                        }}
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
                    onChange={(e) => setSortBy(e.target.value)}
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
              <div className="products-grid">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={() => onNavigate('product', product.id)}
                  />
                ))}
              </div>

              {currentProducts.length === 0 && (
                <div className="no-results">
                  <p>Aucun produit trouvé avec les critères sélectionnés.</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Réinitialiser les filtres
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Précédent
                  </button>
                  
                  {/* Always show first page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
                  >
                    1
                  </button>

                  {/* Show ellipsis if current page is beyond page 3 */}
                  {currentPage > 3 && (
                    <span className="pagination-ellipsis">...</span>
                  )}

                  {/* Show pages around current page */}
                  {[...Array(totalPages)]
                    .map((_, i) => i + 1)
                    .filter(page => {
                      // Show current page and 2 pages before/after, but not first/last page
                      if (page === 1 || page === totalPages) return false;
                      return Math.abs(page - currentPage) <= 1;
                    })
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))
                  }

                  {/* Show ellipsis if there are pages between current range and last page */}
                  {currentPage < totalPages - 2 && (
                    <span className="pagination-ellipsis">...</span>
                  )}

                  {/* Always show last page if there's more than 1 page */}
                  {totalPages > 1 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;