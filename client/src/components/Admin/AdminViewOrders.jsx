// src/components/Admin/ViewOrders.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/admin/adminvieworders.css'; // Import the CSS file

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/getorders');
        console.log(response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="admin-view-orders loading">Loading...</div>;
  if (orders.length === 0) return <div className="admin-view-orders no-orders">No orders found</div>;

  return (
    <div className="admin-view-orders">
      <h2>View Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Total Amount</th>
            <th>Order Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user}</td>
              <td>${order.totalAmount}</td>
              <td>{order.orderStatus}</td>
              <td>
                <Link to={`/admin/manage-orders/${order._id}`}>
                  <button>Process</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewOrders;
