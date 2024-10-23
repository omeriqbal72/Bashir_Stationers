import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd'; // Import Modal and Button from Ant Design
import { useCart } from '../../context/CartContext.jsx';
import { useOrder } from '../../context/OrderContext.jsx';
import '../../css/checkout.css'; // Import the CSS file for styling
import { useUserContext } from '../../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Input } from 'antd';
import { useLocation } from 'react-router-dom';
import OrderVerificationModal from './orderVerificationModal.jsx';
import publicAxiosInstance from '../../utils/publicAxiosInstance.js';

const Checkout = () => {
    const { cart } = useCart();
    const location = useLocation();
    const { productDetails, quantity } = location.state || {};
    const { placeOrder, orderError } = useOrder(); // Fetch placeOrder from OrderContext
    const [deliveryCharges, setDeliveryCharges] = useState(250);
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const { user } = useUserContext();
    const [btnLoading, setbtnLoading] = useState(false);
    const [orderAttempted, setOrderAttempted] = useState(false);
    const [orderverificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);
    const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const tempCart = productDetails ? [{
        product: {
            _id: productDetails._id,
            images: Array.isArray(productDetails.images) ? productDetails.images : [productDetails.images],
            name: productDetails.name,
            price: productDetails.price,
            company: productDetails.company,
            quantity: productDetails.quantity
        },
        quantity: quantity || 1
    }
    ] : cart;

    const subtotal = tempCart.reduce((total, item) => {
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
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'contactNumber') {
            if (value.length <= 10) {
                setContactNumber(value);
            }
        }
    };

    const handleVerificationCodeSubmit = async () => {
        try {
            const response = await publicAxiosInstance.post('/order/confirm', {
                email,
                verificationCode: orderverificationCode,
            });
            setIsVerifyModalVisible(false);
            showSuccessModal();
        } catch (err) {
            console.error('Error confirming order:', err);
            setError('Failed to confirm order.');
        }
    };

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
                        disabled={!user}
                        onClick={() => {
                            Modal.destroyAll();
                            navigate('/profile');
                        }}
                    >
                        See Order
                    </Button>
                </div>
            ],
        });
    };

    const showVerifyModal = () => {
        setIsVerifyModalVisible(true);
    };

    const handleVerifyConfirm = async () => {
        await handleVerificationCodeSubmit();
        //setIsVerifyModalVisible(false);

    };

    const handleVerifyCancel = () => {
        setIsVerifyModalVisible(false);
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        const formattedContactNumber = `+92${contactNumber}`;
        setbtnLoading(true);
        setOrderAttempted(true);
        placeOrder(tempCart, address, paymentMethod, formattedContactNumber, email, totalPrice)
            .finally(() => {
                setbtnLoading(false);
            });
    };

    useEffect(() => {
        if (orderAttempted && !orderError && !btnLoading && user) {
            showSuccessModal(); // Show success modal if there's no error and the loading is done
        } else if (orderAttempted && !orderError && !btnLoading && !user) {
            showVerifyModal();

        } else if (orderAttempted && orderError) {
            // Handle order error (e.g., show a notification or message)
            console.error('Order failed:', orderError);
            Modal.error({
                title: 'Order Failed!',
                content: 'There was an error placing your order. Please try again later.',
            });
        }
    }, [orderError, btnLoading, orderAttempted]); // Trigger when `orderError`, `btnLoading`, or `orderAttempted` changes



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
                        {tempCart.map((item, index) => (
                            <div className="checkout-items" key={`${item.product._id}-${index}`}> {/* Add key prop here */}
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
                                <div className="checkout-span-1"><span className="checkout-total-price-labels">Subtotal</span></div>
                                <div className="checkout-span-2"><span>Rs. {subtotal}</span></div>
                            </div>
                            <div className="checkout-delivery-charges">
                                <div className="checkout-span-1"><span className="checkout-total-price-labels">Delivery charges</span></div>
                                <div className="checkout-span-2"><span>Rs. {deliveryCharges}</span></div>

                            </div>
                            <div className="checkout-total">
                                <div className="checkout-span-1"><span className="checkout-total-price-labels">Total Due</span></div>
                                <div className="checkout-span-2"><span>Rs. {totalPrice}</span></div>
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
                                name="email"
                                value={email}
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
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online-payment"
                                        checked={paymentMethod === 'online-payment'}
                                        onChange={() => setPaymentMethod('online-payment')}
                                        disabled
                                    />
                                    Online Payment
                                </label>
                            </div>
                        </div>

                        <div className="checkout-confirmation-checbox">
                            <input

                                type='checkbox'
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="">
                                I have verfied my order details
                            </label>

                        </div>


                        <div className='checkout-checkout-btn'>
                            <Button type='none'
                                htmlType="submit"
                                size='large'
                                className={`checkout-checkoutbtn ${isChecked ? 'active-btn' : 'disabled-btn'}`}
                                loading={btnLoading}
                                disabled={!isChecked}
                            >
                                Complete Order
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
            <OrderVerificationModal
                isVisible={isVerifyModalVisible}
                onConfirm={handleVerifyConfirm}
                onCancel={handleVerifyCancel}
                verificationCode={orderverificationCode}
                setVerificationCode={setVerificationCode}
                error={error}
            />
        </>
    );
};

export default Checkout;
