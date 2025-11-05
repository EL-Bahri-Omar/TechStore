import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
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
        id: generateOrderId(),
        date: new Date().toISOString(),
        items: [...cart],
        status: 'confirmed',
        ...orderData
      };

      if (user) {
        // User is logged in - save to user's orders
        const userResponse = await fetch(`http://localhost:3001/users/${user.id}`);
        const currentUser = await userResponse.json();

        const updatedOrders = [...(currentUser.orders || []), order];

        const updateResponse = await fetch(`http://localhost:3001/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orders: updatedOrders }),
        });

        if (updateResponse.ok) {
          await updateProfile({ orders: updatedOrders });
          clearCart();
          return { success: true, orderId: order.id, isGuest: false };
        }
        
        return { success: false, error: 'Erreur lors de la sauvegarde de la commande' };
      } else {
        // Guest user - save to guests collection
        const guestOrder = {
          ...order,
          guestInfo: {
            email: orderData.shippingAddress?.email || '',
            firstName: orderData.shippingAddress?.firstName || '',
            lastName: orderData.shippingAddress?.lastName || '',
            phone: orderData.shippingAddress?.phone || ''
          }
        };

        const guestResponse = await fetch('http://localhost:3001/guests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(guestOrder),
        });

        if (guestResponse.ok) {
          clearCart();
          return { success: true, orderId: order.id, isGuest: true };
        }
        
        return { success: false, error: 'Erreur lors de la sauvegarde de la commande invité' };
      }
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const generateOrderId = () => {
    return 'CMD-' + Date.now().toString().slice(-8);
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