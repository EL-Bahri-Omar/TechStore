import React from 'react';

const CategoriesNav = ({ selectedCategory, onCategoryChange, isSidebar = false }) => {
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

  const categoryIcons = {
    all: '🏠',
    Informatique: '💻',
    'Téléphonie & Tablette': '📱',
    Stockage: '💾',
    Impression: '🖨️',
    Audio: '🎧',
    Accessoires: '⌨️',
    Photo: '📷',
    Télévision: '📺'
  };

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

  if (isSidebar) {
    return (
      <div className="categories-sidebar-content">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`sidebar-category-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            <span className="sidebar-category-icon">{categoryIcons[cat]}</span>
            <span className="sidebar-category-name">{categoryNames[cat]}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="categories-navbar-container">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`category-nav-btn ${selectedCategory === cat ? 'active' : ''}`}
        >
          <span className="category-nav-icon">{categoryIcons[cat]}</span>
          <span className="category-nav-name">{categoryNames[cat]}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoriesNav;