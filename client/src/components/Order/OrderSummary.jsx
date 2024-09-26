// src/components/OrderSummary.jsx
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx'; 
import { useOrder } from '../../context/OrderContext.jsx';

const OrderSummary = () => {
  const { cart } = useCart(); // Fetch cartItems from CartContext
  const { placeOrder, orderError } = useOrder(); // Fetch placeOrder from OrderContext

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery');

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    // Call placeOrder from OrderContext
    placeOrder(cart, address, paymentMethod);
  };

  if (orderError) {
    return <div>{orderError}</div>;
  }

  return (
    <div>
      <h1>Order Summary</h1>

      {/* Display Cart Items */}
      <div>
        <h2>Items in Your Cart</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.product._id}>
              {item.product.name} - {item.quantity} x {item.product.price} = {item.quantity * item.product.price}
            </li>
          ))}
        </ul>
      </div>

      {/* Address Form */}
      <div>
        <h2>Shipping Address</h2>
        <form onSubmit={handleSubmitOrder}>
          <label>
            Street:
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
              required
            />
          </label>
          <br />
          <label>
            City:
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
              required
            />
          </label>
          <br />
          <label>
            State:
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleAddressChange}
              required
            />
          </label>
          <br />
          <label>
            Zip Code:
            <input
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={handleAddressChange}
              required
            />
          </label>
          <br />

          {/* Payment Method */}
          <h2>Payment Method</h2>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cash-on-delivery"
              checked={paymentMethod === 'cash-on-delivery'}
              onChange={() => setPaymentMethod('cash-on-delivery')}
            />
            Cash on Delivery
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="online-payment"
              checked={paymentMethod === 'online-payment'}
              onChange={() => setPaymentMethod('online-payment')}
            />
            Online Payment
          </label>
          <br />

          {/* Submit Order */}
          <button type="submit">Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default OrderSummary;
