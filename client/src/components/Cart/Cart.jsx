import React, { useState, useEffect } from 'react';
import ProductQuantity from '../Product/ProductQuantity.jsx';
import '../../css/cart.css';
import { useCart } from '../../context/CartContext.jsx';  // Import the CartContext
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTrashCan, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart , checkout } = useCart(); // Destructure methods from context

  console.log(cart);
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

                  <FontAwesomeIcon className='remove-cart-item' icon={faTrashCan} size='lg' style={{ color: "#511f1f" }} onClick={() => removeFromCart(item.product._id)} />

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
        <h3>Summary</h3>
        <div className='cart-summary-container'>
          <div className='cart-summary-details'>
            <span>{`ITEMS (${cart.length})`} </span>
            <span>Rs. {(totalPrice || 0).toFixed(2)}</span>
          </div>

          <div className="cart-shipping">
            <span>Shipping: </span>
            <span>Rs. 250.00</span>
          </div>

          <div className="cart-total-price">
            <span>Total Price:</span>
            <span>Rs. {(totalPrice + 250 || 0).toFixed(2)}</span>
          </div>

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

