import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd'; // Import Modal and Button from Ant Design
import { useCart } from '../../context/CartContext.jsx';
import { useOrder } from '../../context/OrderContext.jsx';
import '../../css/checkout.css'; // Import the CSS file for styling
import { useUserContext } from '../../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Input } from 'antd';

const Checkout = () => {
    const { cart } = useCart(); // Fetch cartItems from CartContext
    const { placeOrder, orderError } = useOrder(); // Fetch placeOrder from OrderContext
    const [deliveryCharges, setDeliveryCharges] = useState(250);
    const [emailAddress, setEmailAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const { user } = useUserContext();
    const [btnLoading, setbtnLoading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    // Set emailAddress to the user's email if logged in
    useEffect(() => {
        if (user) {
            setEmailAddress(user.email); // Assuming user has an 'email' property
        }
    }, [user]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'emailaddress') {
            setEmailAddress(value); // Update emailAddress state
        } else if (name === 'contactNumber') {
            if (value.length <= 10) {
                setContactNumber(value);
                //console.log(contactNumber) // Update contactNumber state
            }
            //setContactNumber(value);
        }
    };

    // Function to show the success modal with two buttons
    const showSuccessModal = () => {
        Modal.success({
            title: 'Order Placed Successfully!',
            content: 'Thank you for shopping with us. Your order will be processed soon. Check your email for order details.',
            closable: false,
            closeIcon: false,
            centered: true,
            width: 500,
            okButtonProps: { style: { display: 'none' } }, // Hide default OK button
            footer: [
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '0.5rem', gap: '0.5rem' }}>
                    <Button
                        key="home"
                        onClick={() => {
                            Modal.destroyAll(); // Close the modal
                            navigate('/'); // Navigate to Home
                        }}
                    >
                        Go to Home
                    </Button>
                    <Button
                        key="my-orders"
                        type="primary"
                        onClick={() => {
                            Modal.destroyAll(); // Close the modal
                            navigate('/profile'); // Navigate to My Orders
                        }}
                    >
                        See Order
                    </Button>
                </div>
            ],
        });
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();

        const formattedContactNumber = `+92${contactNumber}`;
        setbtnLoading(true);
        placeOrder(cart, address, paymentMethod, formattedContactNumber, emailAddress)
            .then(() => {
                setbtnLoading(false);
                if (user) {
                    showSuccessModal();
                } // Show success modal after placing the order
            })
            .catch((err) => {
                setbtnLoading(false);
                console.error('Order submission failed:', err);
            });
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
                    <h3 style={{ fontWeight: '500' }}>Cart Summary</h3>
                    <h1>PKR {totalPrice.toFixed(2)}</h1>
                    <div className="checkout-items-list">
                        {cart.map((item, index) => (
                            <div className="checkout-items" key={`${item.product._id}-${index}`}>
                                <div className="checkout-item-details">
                                    <img
                                        src={`http://localhost:8080/${(item.product.images && item.product.images.length > 0) ? item.product.images[0] : 'uploads/productImages/default-placeholder.png'}`}
                                        alt={item.name}
                                    />
                                    <div className="checkout-item-name-quantity">
                                        <span style={{ fontWeight: '500' }}>{item.product.name}</span>
                                        <span style={{ fontWeight: '200' }}>Qty: {item.quantity}</span>
                                    </div>
                                </div>
                                <div className="checkout-item-price">
                                    {`Rs. ${(item.product.price || 0).toFixed(2)}`}
                                </div>
                            </div>
                        ))}

                        <div className="checkout-total-price">
                            <div className="checkout-subtotal">
                                <span className="checkout-total-price-labels">Subtotal</span>
                                <span>Rs. {subtotal}</span>
                            </div>
                            <div className="checkout-delivery-charges">
                                <div className="checkout-delivery-charges-subcol">
                                    <span className="checkout-total-price-labels">Delivery charges</span>
                                </div>
                                <span>Rs. {deliveryCharges}</span>
                            </div>
                            <div className="checkout-total">
                                <span className="checkout-total-price-labels">Total Due</span>
                                <span>Rs. {totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-summary-right">
                    <h2>Delivery Information</h2>
                    <form onSubmit={handleSubmitOrder} className="checkout-form">
                        <label>
                            Email:
                            <Input
                                type="text"
                                name="emailaddress"
                                value={emailAddress}
                                onChange={handleChange}
                                required
                                className="checkout-input-field"
                                disabled={!!user}
                            />
                        </label>
                        <label>
                            Contact Number:
                            <Input addonBefore="+92"
                                min={3000000000}
                                max={3999999999}
                                type='number'
                                name="contactNumber"
                                value={contactNumber}
                                onChange={handleChange}
                                required
                                className="checkout-input-field-contact"
                            />
                        </label>
                        <label>
                            Street:
                            <Input
                                type="text"
                                name="street"
                                value={address.street}
                                onChange={handleAddressChange}
                                required
                                className="checkout-input-field"
                            />
                        </label>
                        <div className='checkout-state-country'>
                            <label>
                                City:
                                <Input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={handleAddressChange}
                                    required
                                    className="checkout-input-field"
                                />
                            </label>
                            <label>
                                State:
                                <Input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={handleAddressChange}
                                    required
                                    className="checkout-input-field"
                                />
                            </label>
                        </div>
                        <label>
                            Zip Code:
                            <Input
                                type="number"
                                name="zipCode"
                                value={address.zipCode}
                                onChange={handleAddressChange}
                                required
                                className="checkout-input-field"
                            />
                        </label>

                        <div>
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
                                {/* <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online-payment"
                                        checked={paymentMethod === 'online-payment'}
                                        onChange={() => setPaymentMethod('online-payment')}
                                    />
                                    Online Payment
                                </label> */}
                            </div>
                        </div>


                        <div className='checkout-checkout-btn'>
                            <Button type='none' htmlType="submit" size='large' className="checkout-checkoutbtn" loading={btnLoading}>
                                Complete Order
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Checkout;
