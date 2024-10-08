import React, { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useOrder } from '../../context/OrderContext.jsx';
import '../../css/checkout.css'; // Import the CSS file for styling

const OrderSummary = () => {
    const { cart } = useCart(); // Fetch cartItems from CartContext
    const { placeOrder, orderError } = useOrder(); // Fetch placeOrder from OrderContext
    const [deliveryCharges, setDeliveryCharges] = useState(250);

    const subtotal = cart.reduce((total, item) => {
        return total + (item.product.price || 0) * (item.quantity || 0);
    }, 0);

    const totalPrice = subtotal + deliveryCharges;

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
        placeOrder(cart, address, paymentMethod);
    };

    if (orderError) {
        return <div className="error-message">{orderError}</div>;
    }

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <h1>Rasheed Stationers</h1>
            </div>

            <div className="order-summary-container">
                <div className="order-summary-left">
                    <h3 style={{fontWeight: '500'}}>Cart Summary</h3>
                    <h1>PKR {totalPrice.toFixed(2)}</h1>
                    <div className="checkout-items-list">

                        {cart.map(item => (
                            <div className="checkout-items" key={item.product._id}> {/* Add key prop here */}
                                <div className="checkout-item-details">
                                    <img
                                        src={`http://localhost:8080/${(item.product.images && item.product.images.length > 0) ? item.product.images[0] : 'uploads/productImages/default-placeholder.png'}`}
                                        alt={item.name}
                                    />

                                    <div className='checkout-item-name-quantity'>
                                        <span style={{ fontWeight: '500' }}>{item.product.name}</span>
                                        <span style={{ fontWeight: '200' }}>Qty: {item.quantity}</span>
                                    </div>

                                </div>

                                <div className="checkout-item-price">
                                    {`Rs. ${(item.product.price || 0).toFixed(2)}`}
                                </div>

                            </div>
                        ))}

                        <div className='checkout-total-price'>
                            <div className='checkout-subtotal'>
                                <span className='checkout-total-price-labels'>{`Subtotal`}</span>
                                <span>Rs. {subtotal}</span>
                            </div>
                            <div className='checkout-delivery-charges'>
                                <div className='checkout-delivery-charges-subcol'>
                                    <span className='checkout-total-price-labels'>{`Delivery charges`}</span>
                                    {/* <p className='checkout-delivery-charges-note'>Delivery may take upto 3 to 5 business days.</p> */}
                                </div>
                                <span>Rs. {deliveryCharges}</span>
                            </div>
                            <div className='checkout-total'>
                                <span className='checkout-total-price-labels'>{`Total Due`}</span>
                                <span>Rs. {totalPrice}</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="order-summary-right">
                    <h2>Shipping Information</h2>
                    <form onSubmit={handleSubmitOrder} className="order-form">
                        <label>
                            Street:
                            <input
                                type="text"
                                name="street"
                                value={address.street}
                                onChange={handleAddressChange}
                                required
                                className="input-field"
                            />
                        </label>
                        <label>
                            City:
                            <input
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleAddressChange}
                                required
                                className="input-field"
                            />
                        </label>
                        <label>
                            State:
                            <input
                                type="text"
                                name="state"
                                value={address.state}
                                onChange={handleAddressChange}
                                required
                                className="input-field"
                            />
                        </label>
                        <label>
                            Zip Code:
                            <input
                                type="text"
                                name="zipCode"
                                value={address.zipCode}
                                onChange={handleAddressChange}
                                required
                                className="input-field"
                            />
                        </label>

                        <h2>Payment Method</h2>
                        <div className="payment-methods">
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
                        </div>

                        <button type="submit" className="checkout-checkoutbtn">
                            <span>Complete Order</span>
                            <span>Rs. {totalPrice}</span>
                        </button>
                    </form>
                </div>
            </div>
        </>

    );
};

export default OrderSummary;
