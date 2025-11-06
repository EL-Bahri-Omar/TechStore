export const AlertMessages = {
  // Authentication
  LOGIN_SUCCESS: 'Connexion réussie ! Bienvenue.',
  LOGIN_ERROR: 'Email ou mot de passe incorrect.',
  SIGNUP_SUCCESS: 'Compte créé avec succès ! Bienvenue.',
  SIGNUP_ERROR: 'Erreur lors de la création du compte.',
  LOGOUT_SUCCESS: 'Déconnexion réussie.',
  SESSION_EXPIRED: 'Session expirée. Veuillez vous reconnecter.',

  // Profile
  PROFILE_UPDATE_SUCCESS: 'Profil mis à jour avec succès.',
  PROFILE_UPDATE_ERROR: 'Erreur lors de la mise à jour du profil.',

  // Cart
  ADD_TO_CART_SUCCESS: 'Produit ajouté au panier.',
  REMOVE_FROM_CART_SUCCESS: 'Produit retiré du panier.',
  CART_UPDATE_SUCCESS: 'Panier mis à jour.',
  CART_CLEAR_SUCCESS: 'Panier vidé.',
  CART_EMPTY_ERROR: 'Votre panier est vide.',

  // Favorites
  ADD_TO_FAVORITES_SUCCESS: 'Ajouté aux favoris.',
  REMOVE_FROM_FAVORITES_SUCCESS: 'Retiré des favoris.',
  FAVORITES_LOGIN_REQUIRED: 'Connectez-vous pour gérer vos favoris.',

  // Orders
  ORDER_CREATE_SUCCESS: 'Commande passée avec succès !',
  ORDER_CREATE_ERROR: 'Erreur lors de la création de la commande.',
  ORDER_CANCEL_SUCCESS: 'Commande annulée.',
  ORDER_UPDATE_SUCCESS: 'Commande mise à jour.',

  // Checkout
  CHECKOUT_SUCCESS: 'Paiement traité avec succès.',
  CHECKOUT_ERROR: 'Erreur lors du traitement du paiement.',
  SHIPPING_INFO_REQUIRED: 'Veuillez remplir toutes les informations de livraison.',

  // Payment
  PAYMENT_INFO_REQUIRED: 'Veuillez remplir tous les champs de paiement requis',
  PAYMENT_SUCCESS: 'Paiement traité avec succès! Votre commande est confirmée.',
  PAYMENT_ERROR: 'Erreur lors du traitement du paiement. Veuillez réessayer.',
  PAYMENT_PROCESSING: 'Traitement de votre paiement en cours...',

  // Form Validation
  FORM_VALIDATION_ERROR: 'Veuillez corriger les erreurs dans le formulaire.',
  REQUIRED_FIELDS_MISSING: 'Veuillez remplir tous les champs obligatoires.',
  INVALID_EMAIL: 'Veuillez saisir une adresse email valide.',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 6 caractères.',
  PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas.',

  // Products
  PRODUCT_NOT_FOUND: 'Produit non trouvé.',
  OUT_OF_STOCK: 'Produit en rupture de stock.',

  // General
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  OPERATION_SUCCESS: 'Opération réussie.',
  OPERATION_FAILED: 'Opération échouée. Veuillez réessayer.'
};

export const getFieldError = (fieldName) => {
  const fieldErrors = {
    firstName: 'Le prénom est requis',
    lastName: 'Le nom est requis',
    email: 'L\'email est requis',
    password: 'Le mot de passe est requis',
    address: 'L\'adresse est requise',
    city: 'La ville est requise',
    postalCode: 'Le code postal est requis',
    country: 'Le pays est requis',
    number: 'Numéro de carte invalide',
    name: 'Nom sur la carte requis',
    expiry: 'Date d\'expiration invalide',
    cvv: 'Code de sécurité invalide',
  };

  return fieldErrors[fieldName] || 'Ce champ est requis';
};