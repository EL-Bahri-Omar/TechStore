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
  const { user, refreshUserData } = useAuth();

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
      // Clean the cart items before sending to Firebase
      const cleanCartItems = cart.map(item => ({
        id: String(item.id),
        name: String(item.name),
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: String(item.image || ''),
        ...(item.category && { category: String(item.category) })
      }));

      const order = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        items: cleanCartItems,
        status: 'confirmed',
        shippingAddress: {
          firstName: String(orderData.shippingAddress?.firstName || ''),
          lastName: String(orderData.shippingAddress?.lastName || ''),
          address: String(orderData.shippingAddress?.address || ''),
          city: String(orderData.shippingAddress?.city || ''),
          postalCode: String(orderData.shippingAddress?.postalCode || ''),
          country: String(orderData.shippingAddress?.country || ''),
          ...(orderData.shippingAddress?.phone && { phone: String(orderData.shippingAddress.phone) })
        },
        shippingMethod: {
          id: String(orderData.shippingMethod?.id || 'standard'),
          name: String(orderData.shippingMethod?.name || 'Standard Delivery'),
          price: Number(orderData.shippingMethod?.price || 0),
          duration: String(orderData.shippingMethod?.duration || '')
        },
        paymentMethod: String(orderData.paymentMethod || 'card'),
        orderSummary: {
          subtotal: Number(orderData.orderSummary?.subtotal || 0),
          shipping: Number(orderData.orderSummary?.shipping || 0),
          tax: Number(orderData.orderSummary?.tax || 0),
          total: Number(orderData.orderSummary?.total || 0)
        }
      };

      // Use the renamed Firebase service function
      const createdOrderId = await createOrderFirebase(user?.id, order);
      
      if (createdOrderId) {
        clearCart();
        
        // Refresh user data to get the updated orders
        if (user) {
          await refreshUserData();
        }
        
        return { success: true, orderId: createdOrderId, isGuest: !user };
      }
      
      return { success: false, error: 'Erreur lors de la sauvegarde de la commande' };
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