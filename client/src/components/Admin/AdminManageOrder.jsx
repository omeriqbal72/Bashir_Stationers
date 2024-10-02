// src/components/Admin/ManageOrders.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/admin/adminmanageorder.css'; // Import the CSS file

const AdminManageOrders = () => {
    const { id } = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/getorder/${id}`);
                setOrder(response.data);
                setLoading(false);
                setStatus(response.data.orderStatus);
            } catch (error) {
                console.error('Error fetching order:', error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleUpdateStatus = async () => {
        try {
            await axios.patch(`/update-order-status/${id}`, { orderStatus: status });
            alert('Order status updated successfully');
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!order) return <div className="loading">Order not found</div>;

    return (
        <div className="admin-manage-orders-container">
            <h1>Manage Order</h1>
            <div className="manage-orders">
                <h2>Manage Order - ID: {order._id}</h2>
                <h3>Order Details</h3>
                <p><strong>User ID:</strong> {order.user}</p>
                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount}</p>

                <h4>Products</h4>
                <ul>
                    {order.products.map((item, index) => (
                        <li key={index}>
                            <strong>Product ID:</strong> {item.product}, <strong>Quantity:</strong> {item.quantity}, <strong>Price:</strong> ${item.priceAtPurchase}
                        </li>
                    ))}
                </ul>

                <h4>Shipping Address</h4>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>

                <h4>Order Status</h4>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <button onClick={handleUpdateStatus}>Update Status</button>
            </div>
        </div>

    );
};

export default AdminManageOrders;
