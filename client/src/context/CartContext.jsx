import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Add to Cart function now handles product and quantity
  const addToCart = (product, quantity) => {
    
    const existingProductIndex = cart.findIndex(item => item._id === product._id);
    console.log(existingProductIndex)
    let updatedCart;
    if (existingProductIndex >= 0) {
      // If the product already exists in the cart, update its quantity
      updatedCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }  // Increment quantity
          : item
      );
    } else {
      // If it's a new product, add it to the cart with the selected quantity
      updatedCart = [...cart, { ...product, quantity }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, amount) => {
    const updatedCart = cart.map(item =>
      item._id === id ? { ...item, quantity: item.quantity + amount } : item
    );
    console.log(id)
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    //console.log(id)
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
