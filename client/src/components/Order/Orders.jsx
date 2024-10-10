// src/pages/OrderPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useOrder } from '../../context/OrderContext.jsx';
import Loader from '../Loader/Loader.jsx';
import '../../css/orders/orders.css';
import { Avatar } from 'antd';


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

                <div className='user-orders-container'>
                    {orders.map((order, index) => (
                        <div className='user-orders-card'>
                            <div className='user-orders-card-id'>
                                <Avatar size={64} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>
                                    {index + 1}
                                </Avatar>
                            </div>
                            <div className='user-orders-card-id'>
                                <b>Order ID</b>
                                <span>{order._id}</span>
                            </div>
                            <div className='user-orders-card-amount'>
                                <b>Total Amount</b>
                                <span>Rs.{order.totalAmount}</span>
                            </div>
                            <div className='user-orders-card-status'>
                                <b>Status</b>
                                <span>{order.orderStatus}</span>
                            </div>
                            <div className='user-orders-card-tracking-id'>
                                <b>Tracking ID</b>
                                <span>{order.trackingId}</span>
                            </div>
                            <div className='user-orders-card-btn'>
                                <button onClick={() => handleOrderClick(order)} >See Order</button>
                            </div>

                        </div>

                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
