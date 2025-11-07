import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  createUserProfile, 
  findUserByEmail, 
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  getUserProfile
} from '../services/firebaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId) => {
    try {
      const userData = await getUserProfile(userId);
      if (userData) {
        const { password: _, ...userWithoutPassword } = userData; // Prefix with _ to indicate unused
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
      
      if (foundUser && foundUser.password === password) {
        const { password: _, ...userData } = foundUser; // Prefix with _ to indicate unused
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
        console.log('Permission check failed, proceeding with signup...');
      }
      
      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      const userId = Date.now().toString();
      await createUserProfile(userId, userData);

      const newUser = {
        id: userId,
        ...userData,
        createdAt: new Date().toISOString(),
        orders: [],
        favorites: [],
        addresses: [userData.address]
      };

      const { password: _, ...userWithoutPassword } = newUser; // Prefix with _ to indicate unused
      setUser(userWithoutPassword);
      sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
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