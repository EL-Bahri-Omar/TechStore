import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createOrderFirebase } from '../services/firebaseService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, addAddress } = useAuth();

  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const createOrder = async (orderData) => {
    try {
      const order = {
        items: [...cart],
        total: getCartTotal(),
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: orderData.paymentMethod,
        shippingMethod: orderData.shippingMethod
      };

      if (user && orderData.shippingAddress) {
        console.log('Saving address for user:', user.id);
        const result = await addAddress(orderData.shippingAddress);
        if (result.success) {
          console.log('Address saved successfully');
        } else {
          console.log('Address not saved (duplicate):', result.error);
        }
      }

      const orderId = await createOrderFirebase(user?.id, order);
      
      if (orderId) {
        clearCart();
        return { 
          success: true, 
          orderId: orderId,
          isGuest: !user 
        };
      } else {
        return { success: false, error: 'Erreur lors de la création de la commande' };
      }
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartItemsCount,
    getCartTotal,
    createOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );

};
