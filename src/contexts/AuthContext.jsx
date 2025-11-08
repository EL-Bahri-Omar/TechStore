import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  createUserProfile, 
  findUserByEmail, 
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  getUserProfile,
  addUserAddress
} from '../services/firebaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple hash function
const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId) => {
    try {
      const userData = await getUserProfile(userId);
      if (userData) {
        // Remove password from user data before storing in state/session
        const { password, ...userWithoutPassword } = userData;
        setUser(userWithoutPassword);
        sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      if (userData.id) {
        fetchUserData(userData.id);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchUserData]);

  const login = async (email, password) => {
    try {
      const foundUser = await findUserByEmail(email);
      
      if (foundUser && foundUser.password === hashPassword(password)) {
        // Remove password from user data before storing in state/session
        const { password, ...userData } = foundUser;
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const signup = async (userData) => {
    try {
      let existingUser = null;
      try {
        existingUser = await findUserByEmail(userData.email);
      } catch (error) {
        console.log('Email check failed, proceeding with signup...');
      }
      
      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      const userId = Date.now().toString();
      
      // Create user data with hashed password for Firestore
      const userDataForFirestore = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || '',
        password: hashPassword(userData.password), // Store hashed password
        createdAt: new Date().toISOString(),
        orders: [],
        favorites: [],
        addresses: [] // Start with empty addresses array
      };
      
      await createUserProfile(userId, userDataForFirestore);

      // Create user data without password for session storage
      const userDataForSession = {
        id: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        orders: [],
        favorites: [],
        addresses: [] // Start with empty addresses array
      };

      setUser(userDataForSession);
      sessionStorage.setItem('user', JSON.stringify(userDataForSession));
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Erreur lors de l\'inscription' };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  const updateProfile = async (updatedData) => {
    try {
      await updateUserProfile(user.id, updatedData);
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const addAddress = async (addressObject) => {
    if (!user) return { success: false, error: 'Utilisateur non connecté' };

    try {
      // Format the address as a string
      const formattedAddress = `${addressObject.address}, ${addressObject.city} ${addressObject.postalCode}, ${addressObject.country}`;
      
      // Check if address already exists (case insensitive and trimmed)
      const addressExists = user.addresses?.some(addr => 
        addr.toLowerCase().trim() === formattedAddress.toLowerCase().trim()
      );

      if (!addressExists) {
        await addUserAddress(user.id, formattedAddress);
        const updatedAddresses = [...(user.addresses || []), formattedAddress];
        const updatedUser = { ...user, addresses: updatedAddresses };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, message: 'Adresse ajoutée avec succès' };
      } else {
        return { success: false, error: 'Cette adresse existe déjà' };
      }
    } catch (error) {
      console.error('Error adding address:', error);
      return { success: false, error: 'Erreur lors de l\'ajout de l\'adresse' };
    }
  };

  const refreshUserData = useCallback(async () => {
    if (user?.id) {
      await fetchUserData(user.id);
    }
  }, [user, fetchUserData]);

  const addToFavorites = async (productId) => {
    if (!user) return { success: false, error: 'Utilisateur non connecté' };

    try {
      const isAlreadyFavorite = user.favorites?.includes(productId);
      
      if (isAlreadyFavorite) {
        await removeFromWishlist(user.id, productId);
        const updatedFavorites = user.favorites.filter(id => id !== productId);
        const updatedUser = { ...user, favorites: updatedFavorites };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return { 
          success: true, 
          isFavorite: false,
          message: 'Retiré des favoris'
        };
      } else {
        await addToWishlist(user.id, productId);
        const updatedFavorites = [...(user.favorites || []), productId];
        const updatedUser = { ...user, favorites: updatedFavorites };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return { 
          success: true, 
          isFavorite: true,
          message: 'Ajouté aux favoris'
        };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const isProductInFavorites = (productId) => {
    return user?.favorites?.includes(productId) || false;
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    addAddress,
    addToFavorites,
    isProductInFavorites,
    refreshUserData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};