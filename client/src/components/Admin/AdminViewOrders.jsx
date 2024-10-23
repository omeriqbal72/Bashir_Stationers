// src/components/Admin/ViewOrders.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/admin/adminvieworders.css'; // Import the CSS file
import Loader from '../Loader/Loader';

const AdminViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/getorders');
        const sortedOrders = response.data.sort((a, b) => {
          return new Date(b.orderDate) - new Date(a.orderDate);
        });

        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader height={100} />;
  if (orders.length === 0) return <div className="admin-view-orders no-orders">No orders found</div>;

  return (
    <div className="admin-view-orders-container">
      <h2>View Orders</h2>
      <div className="admin-view-orders">

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Order Status</th>
              <th>Action</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.firstName} {order.user.lastName}</td>
                <td>Rs.{order.totalAmount}</td>
                <td>
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).format(new Date(order.orderDate))}
                </td>

                <td>{order.orderStatus}</td>
                <td>
                  <Link to={`/admin/orders-division/${order._id}`}>
                    <button>Process</button>
                  </Link>

                </td>
                <td className="user-orders-card-btn-delete">
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default AdminViewOrders;
