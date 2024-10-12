import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext.jsx';
import Loader from '../Loader/Loader.jsx';
import '../../css/orders/orderinformation.css';
import {Popover} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const OrderInformation = () => {
    const location = useLocation();
    const { orderId } = location.state || {};
    const { getSingleOrderById, singleOrder, loading, orderError } = useOrder();
    const [popoveropen, setPopoverOpen] = useState(false);
 
    const handleOpenPopoverChange = (newOpen) => {
        setPopoverOpen(newOpen);
    };

    useEffect(() => {
        if (orderId) {
            getSingleOrderById(orderId);
        }
    }, [orderId]);

    if (loading) {
        return <Loader height={60} />;
    }

    if (orderError) {
        return <p>Error: {orderError}</p>;
    }

    const displayOrder = singleOrder;
    if (!displayOrder) {
        return <p>No order details available.</p>;
    }

    const copyToClipboard = () => {
        if (displayOrder.trackingId) {
            navigator.clipboard.writeText(displayOrder.trackingId);

        } else {
            setPopoverOpen(false);
            alert("No Tracking ID available to copy.");
        }
    };

    return (
        <div className="order-info-main">

            <div className="order-info-container">
                <div className="order-info-header">
                    <div className='order-info-header-order-id'>
                        <span style={{ fontWeight: '700', fontSize: '28px' }}>Order ID: <span style={{ fontWeight: '400', fontSize: '24px' }}>{displayOrder._id}</span></span>
  
                        <Popover
                            title="Tracking ID copied!"
                            trigger="click"
                            open={popoveropen}
                            onOpenChange={handleOpenPopoverChange}
                        >
                            <button onClick={copyToClipboard}>
                                <FontAwesomeIcon icon={faCopy} style={{ color: "#ffffff", }} />
                                Tracking ID: {displayOrder.trackingId || 'N/A'}
                            </button>
                        </Popover>

                    </div>
                    <div className='order-info-header-order-status'>
                        <div>
                            <p><strong>Order Date: </strong>
                                <span>{new Date(displayOrder.orderDate).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                                </span>
                            </p>
                            <p><strong>Order Status: </strong>
                                <span style={{ color: displayOrder.orderStatus === 'Completed' ? 'green' : 'red' }}>
                                    {displayOrder.orderStatus}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p><strong>Total Amount: </strong>Rs. {displayOrder.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>

                </div>

                <div className="ordered-products-section">
                    <h2>Ordered Products</h2>
                    {displayOrder.products && displayOrder.products.length > 0 ? (

                        <div className="ordered-products-list">
                            {displayOrder.products
                                .filter(product => product && product.product) // Filter out null or undefined products
                                .map((product, index) => (
                                    <div key={index} className="ordered-products-items">
                                        <div className="ordered-products-item-details">
                                            <img
                                                src={`http://localhost:8080/${product.product && product.product.images && product.product.images.length > 0
                                                    ? product.product.images[0]
                                                    : 'uploads/productImages/default-placeholder.png'
                                                    }`}
                                                alt={product.product ? product.product.name : 'Unknown Product'}
                                            />
                                            <span style={{ fontWeight: '500' }}>{product.product.name}</span>
                                        </div>

                                        <div className='ordered-products-item-price-quantity'>
                                            <span className='ordered-products-item-price'>Rs. {(product.product.price || 0).toFixed(2)}</span>
                                            <span style={{ fontWeight: '200' }}>Qty: {product.quantity}</span>
                                        </div>


                                    </div>
                                ))}
                        </div>
                    ) : (
                        <p>No products found in this order.</p>
                    )}
                </div>

                <div className="ordered-products-payment-delivery-section">
                    <div className="ordered-products-payment-info">
                        <h3>Payment Method</h3>
                        <p>Cash on Delivery</p>
                    </div>
                    <div className="ordered-products-delivery-info">
                        <h3>Delivery Address</h3>
                        <p>{`${displayOrder.shippingAddress.street}, ${displayOrder.shippingAddress.city}, ${displayOrder.shippingAddress.country}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInformation;
