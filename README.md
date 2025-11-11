TechStore - E-commerce Application
Une application e-commerce moderne et performante développée avec React, spécialisée dans la vente de produits technologiques.

# 🚀 Fonctionnalités Principales
🛍️ Expérience Utilisateur
Catalogue Produits - Navigation intuitive avec filtres par catégorie et prix

Recherche Avancée - Recherche en temps réel avec suggestions

Détails Produits - Pages détaillées avec galerie d'images et avis clients

Design Responsive - Interface adaptée mobile, tablette et desktop

# 🛒 Gestion du Panier
Ajout/Modification - Gestion facile des quantités et articles

Calcul Automatique - Sous-total, TVA et frais de livraison

Persistance - Panier sauvegardé entre les sessions

# 👤 Compte Utilisateur
Authentification Sécurisée - Connexion avec Firebase Auth

Profil Utilisateur - Gestion des informations personnelles

Liste de Favoris - Sauvegarde des produits préférés

Historique des Commandes - Suivi complet des achats

# 💳 Processus d'Achat
Checkout Intuitif - Processus de commande en plusieurs étapes

Paiement Sécurisé - Intégration de méthodes de paiement

Confirmation - Reçu détaillé avec suivi de livraison

# 🛠️ Technologies Utilisées
Frontend
React 18 - Framework principal

Vite - Build tool et environnement de développement

React Router - Navigation et routing

Context API - Gestion d'état globale

Backend & Services
Firebase Firestore - Base de données NoSQL

Firebase Authentication - Gestion des utilisateurs

Firebase Hosting - Déploiement (optionnel)

Styling & UX
CSS3 Moderne - Flexbox, Grid, animations

Design Responsive - Mobile-first approach

Icônes Lucide React - Interface cohérente

# 📦 Installation et Développement
Prérequis
Node.js 18+

npm ou yarn

Compte Firebase

# 🚀 Démarrage Rapide
Cloner le repository

bash
git clone https://github.com/EL-Bahri-Omar/techstore.git
cd techstore
Installer les dépendances

bash
npm install
Configuration Firebase

bash
# Créer le fichier .env.local
cp .env.example .env.local

# Configurer avec vos credentials Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Lancer en développement

bash
npm run dev
L'application sera accessible sur http://localhost:5173

# 📋 Scripts Disponibles
bash
npm run dev          # Mode développement
npm run build        # Build de production
npm run preview      # Preview du build
npm run lint         # Vérification du code

# 🏗️ Architecture du Projet
text
techstore/
├── public/                 # Assets statiques
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── ui/           # Composants d'interface
│   │   ├── product/      # Composants produits
│   │   └── layout/       # Composants de mise en page
│   ├── contexts/         # Contexts React
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── AlertContext.jsx
│   │   └── index.js
│   ├── pages/            # Pages de l'application
│   │   ├── HomePage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   └── ...
│   ├── services/         # Services et API
│   │   ├── firebaseService.js
│   │   └── api.js
│   ├── utils/            # Utilitaires
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── alertMessages.js
│   ├── hooks/            # Custom hooks
│   │   └── useLocalStorage.js
│   ├── assets/           # Ressources
│   │   └── images/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── vercel.json

# 🔧 Configuration Firebase
Structure des Données
Collection: products
javascript
{
  id: string,
  name: string,
  price: number,
  category: string,
  description: string,
  features: string[],
  images: string[],
  rating: number,
  reviews: Array<{
    user: string,
    rating: number,
    comment: string,
    date: string
  }>,
  stock: number,
  createdAt: timestamp
}
Collection: users
javascript
{
  uid: string,
  email: string,
  displayName: string,
  favorites: string[], // product IDs
  orders: string[], // order IDs
  createdAt: timestamp
}

# 🚀 Déploiement
Vercel (Recommandé)
bash
npm run build
vercel --prod
Firebase Hosting
bash
npm run build
firebase deploy
Variables d'Environnement en Production
Assurez-vous de configurer les variables d'environnement dans votre plateforme de déploiement.

# 📱 Responsive Design
L'application utilise une approche mobile-first avec des breakpoints optimisés :

Mobile : < 768px

Tablette : 768px - 1023px

Desktop : ≥ 1024px

# 🎨 Guidelines de Développement
Structure des Composants
jsx
// Convention de nommage
const ProductCard = ({ product, onViewDetails }) => {
  // State et hooks
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Handlers
  const handleFavoriteToggle = () => { ... };
  
  // Rendu
  return (
    <div className="product-card">
      {/* JSX */}
    </div>
  );
};
Convention de Code
Composants en PascalCase

Fichiers en PascalCase pour les composants

Hooks personnalisés préfixés par "use"

CSS en BEM methodology

# 🔒 Sécurité
Validation des données côté client et serveur

Règles de sécurité Firebase configurées

Protection des routes authentifiées

Sanitization des entrées utilisateur

# 📊 Performance
Code Splitting automatique avec Vite

Lazy Loading des images

Optimisation des bundles

Caching stratégique

# 🤝 Contribution
Fork le projet

Créer une branche feature (git checkout -b feature/AmazingFeature)

Commit les changements (git commit -m 'Add AmazingFeature')

Push sur la branche (git push origin feature/AmazingFeature)

Ouvrir une Pull Request

# 📄 Licence
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

# 👨‍💻 Auteur
EL Bahri Omar
GitHub: @EL-Bahri-Omar


# 🔗 Liens Utiles
Documentation Firebase : https://firebase.google.com/docs

Documentation React : https://reactjs.org/docs

Live Demo : https://technologiastore.vercel.app

Issues : https://github.com/EL-Bahri-Omar/techstore/issues
