// src/pages/OrderPage.jsx
import React, { useEffect } from 'react';
import { useOrder } from '../../context/OrderContext.jsx';
import Loader from '../Loader/Loader.jsx'

const Orders = () => {
    const { fetchUserOrders, orders, loading , orderError } = useOrder();

    useEffect(() => {
        fetchUserOrders(); 
    }, []);

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
                    {orders.map((order , index) => (
                        <li key={order._id}>
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
