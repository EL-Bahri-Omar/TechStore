import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container text-center">
        <p>© {currentYear} TechStore - Tous droits réservés</p>
        <p>Application e-commerce moderne et responsive</p>
      </div>
    </footer>
  );
};

export default Footer;