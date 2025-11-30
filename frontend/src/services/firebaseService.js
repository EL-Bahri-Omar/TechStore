import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { 
        id: docSnap.id, 
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, 'products'), 
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

export const getFeaturedProducts = async (count = 7) => {
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('rating', 'desc'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};

export const searchProducts = async (searchTerm) => {
  try {
    const allProducts = await getProducts();
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const addToWishlist = async (userId, productId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayUnion(productId)
    });
    return productId;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (userId, productId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayRemove(productId)
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const getUserWishlist = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const favoriteIds = userData.favorites || [];
      
      const allProducts = await getProducts();
      
      const wishlistProducts = allProducts.filter(product => {
        return favoriteIds.some(favId => 
          String(favId) === String(product.id) || 
          Number(favId) === Number(product.id) ||
          favId === product.id
        );
      });
      
      return wishlistProducts;
    }
    return [];
  } catch (error) {
    console.error('Error getting user wishlist:', error);
    throw error;
  }
};

export const isProductInWishlist = async (userId, productId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return (userData.favorites || []).includes(productId);
    }
    return false;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    throw error;
  }
};

export const createOrderFirebase = async (userId, orderData) => {
  try {
    const cleanOrderData = {
      id: `CMD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'confirmed',
      items: orderData.items.map(item => ({
        id: String(item.id),
        name: String(item.name),
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: String(item.image || ''),
        ...(item.category && { category: String(item.category) }),
        ...(item.description && { description: String(item.description) })
      })),
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

    if (userId) {
      const userRef = doc(db, 'users', userId);
      
      const userDoc = await getDoc(userRef);
      const currentOrders = userDoc.exists() ? (userDoc.data().orders || []) : [];
      
      const updatedOrders = [...currentOrders, cleanOrderData];
      
      await updateDoc(userRef, {
        orders: updatedOrders
      });
      
      for (const item of cleanOrderData.items) {
        try {
          await updateProductStock(item.id, item.quantity);
        } catch (stockError) {
          console.error(`Error updating stock for product ${item.id}:`, stockError);
        }
      }
      
      return cleanOrderData.id;
    } else {
      const guestOrder = {
        ...cleanOrderData,
        guestInfo: {
          email: String(orderData.shippingAddress?.email || ''),
          firstName: String(orderData.shippingAddress?.firstName || ''),
          lastName: String(orderData.shippingAddress?.lastName || ''),
          phone: String(orderData.shippingAddress?.phone || '')
        }
      };

      const docRef = await addDoc(collection(db, 'guests'), guestOrder);
      
      for (const item of cleanOrderData.items) {
        try {
          await updateProductStock(item.id, item.quantity);
        } catch (stockError) {
          console.error(`Error updating stock for product ${item.id}:`, stockError);
        }
      }
      
      return docRef.id;
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId, userId = null) => {
  try {
    if (userId) {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const order = (userData.orders || []).find(order => order.id === orderId);
        return order || null;
      }
    } else {
      const q = query(collection(db, 'guests'), where('id', '==', orderId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.orders || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

export const createUserProfile = async (userId, userData) => {
  try {
    const { password, confirmPassword, ...userDataWithoutPassword } = userData;
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      id: userId,
      createdAt: new Date().toISOString(),
      orders: [],
      favorites: [],
      addresses: []
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const addUserAddress = async (userId, address) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      addresses: arrayUnion(address)
    });
  } catch (error) {
    console.error('Error adding user address:', error);
    throw error;
  }
};

export const updateProductStock = async (productId, quantitySold) => {
  try {
    const product = await getProductById(productId);
    if (product) {
      const newStock = Math.max(0, product.stock - quantitySold);
      await updateDoc(doc(db, 'products', productId), {
        stock: newStock
      });
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const products = await getProducts();
    const categories = [...new Set(products.map(product => product.category))];
    return categories.map(category => ({ id: category, name: category }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};