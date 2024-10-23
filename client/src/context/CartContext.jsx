import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useUserContext } from './UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { openNotification } = useNotification();
  const { user } = useUserContext();
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [error , setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Ref to store timers for delayed backend sync
  const syncTimers = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const response = await axiosInstance.get('/cart');
          const cartData = response.data.cart;

          if (cartData && Array.isArray(cartData.items)) {
            const formattedCart = cartData.items
              .filter(item => item.product !== null)
              .map(item => ({
                product: filterProductData(item.product), 
                quantity: item.quantity,
                selectedColor: item.selectedColor,
              }));
            setCart(formattedCart);
            persistCartToLocalStorage(formattedCart);
          } else {
            console.warn('Cart items are not available or not an array');
            setCart([]);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          setError('Failed to fetch cart. Please try again later.');
        }
        finally {
          setLoading(false);
        }
        
      } else {
        const storedCart = localStorage.getItem('cart');
        setCart(storedCart ? JSON.parse(storedCart) : []);
      }
    };

    fetchCart();
  }, [user]);

 
  const filterProductData = (product) => {
    if (!product) {
      return null; // Return null if product is deleted
    }
    const { _id, name, price, images , quantity } = product; // Only these fields will be stored
    return { _id, name, price, images , quantity };
  };

  const persistCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const syncCartWithBackend = (action, product, quantity , selectedColor) => {
    if (user) {
      if (syncTimers.current[product._id]) {
        clearTimeout(syncTimers.current[product._id]);
      }

      syncTimers.current[product._id] = setTimeout(async () => {
        try {
          setLoading(true); 
          if (action === 'add') {
           
            let response = await axiosInstance.post('/cart/add', { productId: product._id, quantity , selectedColor });
            if (response.status === 400) {
              // Set error for insufficient stock
              setError(error.response.data.message); 
              return;
            } else if (response.status === 200){
              setError(null); 
              
            }
          } else if (action === 'update') {
            
            await axiosInstance.put('/cart/update', { productId: product._id, quantity , selectedColor });
          } else if (action === 'remove') {
            await axiosInstance.post('/cart/remove', { productId: product._id , selectedColor});
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message); 
          } else {
            setError('An error occurred. Please try again later.'); 
          }
        }
        finally {
          setLoading(false);
        }
      }, 1000);
    }
  };

  const checkout = () => {
    // if (user) {
    //   // User is logged in, navigate to order summary
    //   navigate('/order-summary');
    // } else {
    //   // User is not logged in, navigate to login page
    //   navigate('/login');
    // }
    navigate('/order-summary');
  };

  const addToCart = (product, quantity, selectedColor, navigateToCart) => {
    if (quantity > product.quantity) {
      setError("Qunatity not avaialable in Stock");
      setTimeout(() => setError(null), 3000);
      return; 
    }
  
    const existingProductIndex = cart.findIndex(
      item => item.product._id === product._id && item.selectedColor === selectedColor
    );
  
    let updatedCart;
  
    const totalQuantityInCart = cart.reduce((total, item) => {
      if (item.product._id === product._id) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  
    if (totalQuantityInCart + quantity > product.quantity) {
      setError(`Qunatity not avaialable in Stock`);
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    if (existingProductIndex >= 0) {
      updatedCart = cart.map(item =>
        item.product._id === product._id && item.selectedColor === selectedColor
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { product: filterProductData(product), quantity, selectedColor }];
    }

    persistCartToLocalStorage(updatedCart);
    setCart(updatedCart);
  
    if (user) {
      syncCartWithBackend('add', product, quantity, selectedColor);
    }
    if (existingProductIndex < 0 || (existingProductIndex >= 0 && updatedCart)) {
      if (navigateToCart) {
        navigateToCart();
      }
      else{
        openNotification('success', 'Added to Cart', `${product.name} has been added to your cart.` , navigate);
      }
    }
  };
  
  

  const updateQuantity = (productId , amount , selectedColor) => {
   
    const updatedCart = cart.map(item =>
      item.product._id === productId && item.selectedColor === selectedColor
        ? { ...item, quantity: item.quantity + amount }
        : item
    );
  
    persistCartToLocalStorage(updatedCart);
    setCart(updatedCart);
  
    const product = updatedCart.find(
      item => item.product._id === productId && item.selectedColor === selectedColor
    );
  
    if (product) {
      const newQuantity = product.quantity;
      syncCartWithBackend('update', product.product, newQuantity , selectedColor);
    }
  };
  

  const removeFromCart = (productId, selectedColor) => {
  const updatedCart = cart.filter(
    item => !(item.product._id === productId && item.selectedColor === selectedColor)
  );

  persistCartToLocalStorage(updatedCart);
  setCart(updatedCart);

  const product = cart.find(
    item => item.product._id === productId && item.selectedColor === selectedColor
  );

  if (product) {
    syncCartWithBackend('remove', product.product , 0 , selectedColor);
  }
};


  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart , checkout , error , loading}}>
      {children}
    </CartContext.Provider>
  );
};
