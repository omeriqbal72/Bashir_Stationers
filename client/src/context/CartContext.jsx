import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useUserContext } from './UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUserContext();
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Ref to store timers for delayed backend sync
  const syncTimers = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axiosInstance.get('/cart');
          const cartData = response.data.cart;

          if (cartData && Array.isArray(cartData.items)) {
            const formattedCart = cartData.items.map(item => ({
              product: filterProductData(item.product), // Filtered product data
              quantity: item.quantity
            }));
            setCart(formattedCart);
            persistCartToLocalStorage(formattedCart);
          } else {
            console.warn('Cart items are not available or not an array');
            setCart([]);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      } else {
        const storedCart = localStorage.getItem('cart');
        setCart(storedCart ? JSON.parse(storedCart) : []);
      }
    };

    fetchCart();
  }, [user]);

 
  const filterProductData = (product) => {
    const { _id, name, price, images } = product; // Only these fields will be stored
    return { _id, name, price, images };
  };

  const persistCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const syncCartWithBackend = (action, product, quantity) => {
    if (user) {
      // Clear any previous timer for the same product
      if (syncTimers.current[product._id]) {
        clearTimeout(syncTimers.current[product._id]);
      }

      syncTimers.current[product._id] = setTimeout(async () => {
        try {
          if (action === 'add') {
            await axiosInstance.post('/cart/add', { productId: product._id, quantity });
          } else if (action === 'update') {
            await axiosInstance.put('/cart/update', { productId: product._id, quantity });
          } else if (action === 'remove') {
            await axiosInstance.post('/cart/remove', { productId: product._id });
          }
        } catch (error) {
          console.error(`Error during ${action} cart action:`, error);
        }
      }, 1000);
    }
  };

  const checkout = () => {
    if (user) {
      // User is logged in, navigate to order summary
      navigate('/order-summary');
    } else {
      // User is not logged in, navigate to login page
      navigate('/login');
    }
  };

  const addToCart = (product, quantity) => {
    const existingProductIndex = cart.findIndex(item => item.product._id === product._id);
    let updatedCart;

    if (existingProductIndex >= 0) {
      updatedCart = cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { product: filterProductData(product), quantity }];
    }

    persistCartToLocalStorage(updatedCart);
    setCart(updatedCart);

    syncCartWithBackend('add', product, quantity);
  };

  const updateQuantity = (productId, amount) => {
    const updatedCart = cart.map(item =>
      item.product._id === productId
        ? { ...item, quantity: item.quantity + amount }
        : item
    );

    persistCartToLocalStorage(updatedCart);
    setCart(updatedCart);

    const product = updatedCart.find(item => item.product._id === productId);
    const newQuantity = product.quantity;
    syncCartWithBackend('update', product.product, newQuantity);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);

    persistCartToLocalStorage(updatedCart);
    setCart(updatedCart);

    // Find the product object in the cart to pass it for backend sync
    const product = cart.find(item => item.product._id === productId);
    if (product) syncCartWithBackend('remove', product.product);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart , checkout}}>
      {children}
    </CartContext.Provider>
  );
};
