import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/admin/adminmanageorder.css';
import Loader from '../Loader/Loader';

const AdminManageOrders = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [shippingStatus, setShippingStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [trackingId, setTrackingId] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/getorder/${id}`);
                setOrder(response.data);
                setLoading(false);
                setStatus(response.data.orderStatus);
                setShippingStatus(response.data.shippingStatus);
                setPaymentStatus(response.data.paymentStatus);
                setTrackingId(response.data.trackingId);
            } catch (error) {
                console.error('Error fetching order:', error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleUpdateStatus = async () => {
        try {
            const updatedFields = {
                orderStatus: status,
                shippingStatus: shippingStatus,
                paymentStatus: paymentStatus,
                trackingId: trackingId
            };

            await axios.patch(`/update-order-status/${id}`, updatedFields);
            alert('Order updated successfully');
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) return <Loader />;
    if (!order) return <div className="loading">Order not found</div>;

    return (
        <div className="admin-manage-orders-container">
            <h1>Manage Order</h1>
            <div className="manage-orders">
                <h2>Manage Order - ID: {order._id}</h2>
                <h3>Order Details</h3>
                <p><strong>User :</strong> {order.user.firstName} {order.user.lastName}</p>
                <p><strong>Customer Contact Number:</strong> {order.user.contactNumber}</p>
                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> Rs.{order.totalAmount}</p>

                <h4>Products</h4>
                <ul>
                    {order.products.map((item, index) => (
                        <li key={index}>
                            <strong>Product :</strong> {item.product.name}, <strong>Quantity:</strong> {item.quantity}, <strong>Price:</strong> ${item.priceAtPurchase}
                        </li>
                    ))}
                </ul>

                <h4>Shipping Address</h4>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>

                <div>
                    <h4>Order Status</h4>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <h4>Shipping Status</h4>
                    <select value={shippingStatus} onChange={(e) => setShippingStatus(e.target.value)}>
                        <option value="Not Shipped">Not Shipped</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>

                <div>
                    <h4>Payment Status</h4>
                    <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>

                <div>
                    <h4>Assign Tracking Id</h4>
                    <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                    />
                </div>

                <button onClick={handleUpdateStatus}>Update</button>
            </div>
        </div>
    );
};

export default AdminManageOrders;
