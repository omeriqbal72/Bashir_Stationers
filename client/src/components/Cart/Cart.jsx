import React, { useState, useEffect } from 'react';
import ProductQuantity from '../Product/ProductQuantity.jsx';
import '../../css/cart.css';
import { useCart } from '../../context/CartContext.jsx';  // Import the CartContext
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTrashCan, faCartShopping } from '@fortawesome/free-solid-svg-icons';


const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();  // Destructure methods from context

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  //console.log(cart)

  return (
    <div className="cart-container">
      <div className="cart-items">
        <div className='total-cart-items'>
          <FontAwesomeIcon icon={faCartShopping} size="xl" style={{ color: "#000000" }} />
          <h2>Shopping Cart</h2>
        </div>
        <p>Total items: {cart.length}</p>
        <div className="cart-item-list">
          {cart.map(item => (
            <div className="cart-item" key={item._id}>
              <div className="item-details">
                <img
                  src={`http://localhost:8080/${item.images[0] || 'uploads/productImages/default-placeholder.png'}`}
                  alt={item.name}
                />
                <span>{item.name}</span>
              </div>

              {/* Use ProductQuantity for quantity control, assuming it accepts props for updating quantity */}

              <div className='cart-items-info'>
                <ProductQuantity
                  quantity={item.quantity}
                  onIncrement={() => updateQuantity(item._id, 1)}
                  onDecrement={() => item.quantity > 1 && updateQuantity(item._id, -1)}
                />

                <div className="item-price">
                  {`Rs. ${item.price.toFixed(2)}`}
                </div>

                <FontAwesomeIcon className='remove-cart-item' icon={faTrashCan} size='lg' style={{ color: "#511f1f" }} onClick={() => removeFromCart(item._id)} />

              </div>

            </div>
          ))}
        </div>
        <a href="/" className="back-to-shop">← Back to shop</a>
      </div>

      <div className="cart-summary">
        <h3>Summary</h3>
        <div className='cart-summary-container'>

          <div className='cart-summary-details'>
            <span>{`ITEMS (${cart.length})`} </span>
            <span>Rs. {totalPrice.toFixed(2)}</span>
          </div>

          <div className="cart-shipping">
            <span>Shipping: </span>
            <span>Rs. 250.00</span>
          </div>

          <div className="cart-total-price">
            <span>Total Price:</span>
            <span>Rs. {(totalPrice + 250).toFixed(2)}</span>
          </div>

          <div className="cart-checkout-btn-container">
            <button className="cart-checkout-btn">
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
