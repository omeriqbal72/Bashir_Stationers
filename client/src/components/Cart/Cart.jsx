import React from 'react';
import ProductQuantity from '../Product/ProductQuantity.jsx';
import '../../css/cart.css';
import { useCart } from '../../context/CartContext.jsx';  // Import the CartContext
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTrashCan, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import checkoutBoy from '../../Ui_Images/checkout-boy.png';
import Loader from '../Loader/Loader.jsx';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, checkout, loading } = useCart(); // Destructure methods from context
  console.log(cart)
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
            cart.map((item, index) => {
              const isOutOfStock = item.product.quantity === 0;
              console.log(item.product.quantity)
              return (

                <div className="cart-item-top">
                  <div
                    className={`cart-item ${isOutOfStock ? 'disabled-item' : ''}`}
                    key={`${item.product._id}-${item.color || 'default'}-${index}`}
                  >
                    <div className="item-details">
                      <img
                        src={`http://localhost:8080/${(item.product.images && item.product.images.length > 0) ? item.product.images[0] : 'uploads/productImages/default-placeholder.png'}`}
                        alt={item.product.name}
                      />
                      <span>{item.product.name}</span>
                    </div>

                    <div className='cart-items-info'>
                      <ProductQuantity
                        quantity={item.quantity}
                        onIncrement={() => item.quantity < item.product.quantity && !isOutOfStock && updateQuantity(item.product._id, 1, item.selectedColor)}
                        onDecrement={() => item.quantity > 1 && !isOutOfStock && updateQuantity(item.product._id, -1, item.selectedColor)}
                        disableIncrement={item.quantity >= item.product.quantity || isOutOfStock}  // Disable if out of stock or at max quantity
                        disableDecrement={item.quantity <= 1 || isOutOfStock}
                      />

                      <div className="item-price">
                        {`Rs. ${(item.product.price || 0).toFixed(2)}`}
                      </div>

                      <div className={`remove-cart-item ${isOutOfStock ? 'disabled-item' : ''}`}>
                        <FontAwesomeIcon icon={faTrashCan} size='lg' style={{ color: isOutOfStock ? '#ff4040' : '#511f1f' }} onClick={() => removeFromCart(item.product._id, item.selectedColor)} />
                      </div>
                    </div>

                  </div>
                  {isOutOfStock && (
                    <div className="out-of-stock-msg">
                      <small>Remove this item, it's out of stock.</small>
                    </div>
                  )}


                  {item.quantity > item.product.quantity && (
                    <div className="out-of-stock-msg">
                      <small>Reduce your cart quantity to place the order.</small>
                    </div>
                  )}
                </div>

              );
            })
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
            <span> Rs. {(totalPrice || 0).toFixed(2)}</span>
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
