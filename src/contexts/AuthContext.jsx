import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData = { ...foundUser };
        delete userData.password; // Ne pas stocker le mot de passe dans le state
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
      // Vérifier si l'email existe déjà
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      
      const emailExists = users.some(u => u.email === userData.email);
      if (emailExists) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      // Créer un nouvel utilisateur
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        orders: [],
        favorites: [],
        addresses: [userData.address]
      };

      const signupResponse = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (signupResponse.ok) {
        const { password, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return { success: true };
      } else {
        return { success: false, error: 'Erreur lors de l\'inscription' };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      }
      return { success: false, error: 'Erreur lors de la mise à jour' };
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

const addToFavorites = async (productId) => {
    if (!user) return { success: false, error: 'Utilisateur non connecté' };

    try {
      // Récupérer l'utilisateur actuel
      const response = await fetch(`http://localhost:3001/users/${user.id}`);
      const currentUser = await response.json();

      // Vérifier si le produit est déjà en favori
      const isAlreadyFavorite = currentUser.favorites?.includes(productId);
      
      let updatedFavorites;
      if (isAlreadyFavorite) {
        // Retirer des favoris
        updatedFavorites = currentUser.favorites.filter(id => id !== productId);
      } else {
        // Ajouter aux favoris
        updatedFavorites = [...(currentUser.favorites || []), productId];
      }

      // Mettre à jour l'utilisateur
      const updateResponse = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorites: updatedFavorites }),
      });

      if (updateResponse.ok) {
        const updatedUser = { ...user, favorites: updatedFavorites };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return { 
          success: true, 
          isFavorite: !isAlreadyFavorite,
          message: isAlreadyFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
        };
      }
      return { success: false, error: 'Erreur lors de la mise à jour' };
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};