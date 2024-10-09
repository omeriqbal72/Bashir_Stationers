import React, { useState, useEffect } from 'react';
import ProductQuantity from '../Product/ProductQuantity.jsx';
import '../../css/cart.css';
import { useCart } from '../../context/CartContext.jsx';  // Import the CartContext
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTrashCan, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import checkoutBoy from '../../Ui_Images/checkout-boy.png'
import brownPaper from '../../Ui_Images/brown-paper.jpg'
import Loader from '../Loader/Loader.jsx';
const Cart = () => {
  const { cart, updateQuantity, removeFromCart, checkout, loading } = useCart(); // Destructure methods from context

  
  const totalPrice = cart.reduce((total, item) => {
    return total + (item.product.price || 0) * (item.quantity || 0);
  }, 0);

  return (
    <div className="cart-container">
      <div className="cart-items">
        <div className='total-cart-items'>
          <FontAwesomeIcon icon={faCartShopping} size="xl" style={{ color: "#000000" }} />
          <h2>Shopping Cart</h2>
        </div>
        <p>Total items: {cart.length}</p>
        <div className="cart-item-list">
          {cart.length > 0 ? (
            cart.map(item => (
              <div className="cart-item" key={item.product._id}> {/* Add key prop here */}
                <div className="item-details">
                  <img
                    src={`http://localhost:8080/${(item.product.images && item.product.images.length > 0) ? item.product.images[0] : 'uploads/productImages/default-placeholder.png'}`}
                    alt={item.name}
                  />
                  <span>{item.product.name}</span>
                </div>

                <div className='cart-items-info'>
                  <ProductQuantity
                    quantity={item.quantity}
                    onIncrement={() => updateQuantity(item.product._id, 1)}
                    onDecrement={() => item.quantity > 1 && updateQuantity(item.product._id, -1)}
                  />

                  <div className="item-price">
                    {`Rs. ${(item.product.price || 0).toFixed(2)}`}
                  </div>

                  <div className='remove-cart-item'>
                    <FontAwesomeIcon icon={faTrashCan} size='lg' style={{ color: "#511f1f" }} onClick={() => removeFromCart(item.product._id)} />
                  </div>

                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <a href="/" className="back-to-shop">← Back to shop</a>
      </div>


      <div className="cart-summary">
    
        <div className='cart-summary-img'>
          <img src={checkoutBoy} alt="checkout" />
        </div>

        <div className='cart-summary-container'>
          <div className='cart-summary-details'>
            <span>{`ITEMS (${cart.length})`} </span>
          </div>

          <div className="cart-total-price">
            <span style={{ fontWeight: 'bold' }}>SubTotal: </span>
            <span > Rs. {(totalPrice || 0).toFixed(2)}</span>
          </div>

          <span className='cart-shipping-msg'>No hidden fees. Taxes and delivery charges are calculated and added to your total at checkout.</span>


          <div className="cart-checkout-btn-container">
            <button className="cart-checkout-btn" onClick={checkout}>
              <FontAwesomeIcon icon={faCreditCard} style={{ color: "#000" }} />
              CHECKOUT
            </button>
          </div>
        </div>
      </div>


    </div>
  );  
};

export default Cart;

