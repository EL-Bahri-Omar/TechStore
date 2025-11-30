import React from 'react';

const CategoriesNav = ({ selectedCategory, onCategoryChange }) => {
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

  const categoryIcons = {
    all: '🏠',
    informatique: '💻',
    'Téléphonie & Tablette': '📱',
    Stockage: '💾',
    impression: '🖨️',
    Audio: '🎧',
    Accessoires: '⌨️',
    photo: '📷',
    Television: '📺'
  };

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

  return (
    <div className="categories-navbar">
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
    </div>
  );
};

export default CategoriesNav;