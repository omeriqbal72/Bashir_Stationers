// src/pages/OrderPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useOrder } from '../../context/OrderContext.jsx';
import Loader from '../Loader/Loader.jsx';

const Orders = () => {
    const { fetchUserOrders, orders, loading, orderError } = useOrder();
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const handleOrderClick = (order) => {
        // Pass orderId and other order details via state
        navigate('/order-information', { state: { orderId: order._id, order } });
    };

    if (loading) {
        return <Loader />;
    }

    if (orderError) {
        return <p>Error: {orderError}</p>;
    }

    return (
        <div>
            <h1>Your Orders</h1>
            {orderError && <p>{orderError}</p>}
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map((order, index) => (
                        <li 
                            key={order._id} 
                            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}
                            onClick={() => handleOrderClick(order)} // Pass the entire order object
                        >
                            <h3>Order No: {index + 1}</h3>
                            <p>Total Amount: ${order.totalAmount}</p>
                            <p>Status: {order.orderStatus}</p>
                            <p>Tracking Id: {order.trackingId}</p>
                            {/* Add more order details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;
