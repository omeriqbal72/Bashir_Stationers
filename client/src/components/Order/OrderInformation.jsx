// src/pages/OrderInformation.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { useOrder } from '../../context/OrderContext.jsx';
import Loader from '../Loader/Loader.jsx';

const OrderInformation = () => {
    const location = useLocation();
    const { orderId } = location.state || {}; 
    const { getSingleOrderById, singleOrder, loading, orderError } = useOrder();

    useEffect(() => {
        if (orderId) {
            getSingleOrderById(orderId); 
        }
    }, [orderId]);
    console.log(singleOrder)

    if (loading) {
        return <Loader />;
    }

    if (orderError) {
        return <p>Error: {orderError}</p>;
    }

    const displayOrder =  singleOrder;

    if (!displayOrder) {
        return <p>No order details available.</p>;
    }

    return (
        <div>
            <h1>Order Information</h1>
            <p>Order ID: {displayOrder._id}</p>
            <p>Total Amount: ${displayOrder.totalAmount}</p>
            <p>Status: {displayOrder.orderStatus}</p>
            <p>Tracking ID: {displayOrder.trackingId}</p>

            <h2>Products in this Order</h2>
            {displayOrder.products && displayOrder.products.length > 0 ? (
                <ul>
                    {displayOrder.products.map((product, index) => (
                        <li key={index}>
                            <h3>Product Name: {product.product.name}</h3>
                            <p>Quantity: {product.quantity}</p>
                            <p>Price: ${product.product.price}</p>
                           
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products found in this order.</p>
            )}
        </div>
    );
};

export default OrderInformation;
