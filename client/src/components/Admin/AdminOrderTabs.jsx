import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../Loader/Loader';
const { TabPane } = Tabs;
import '../../css/admin/adminordertabs.css'

const AdminOrderTabs = ({ onOrderChange }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async (status) => {
        try {
            const response = await axios.get(`/get-orders-by-status?status=${status}`);
            const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (key) => {
        fetchOrders(key);
    };

    const handleOrderClick = (id) => {
        onOrderChange(id); 
    };

    const formatDate = (dateString) => {
      const options = { month: 'long', day: 'numeric', year: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-US', options);
  };
    useEffect(() => {
        fetchOrders('Pending'); 
    }, []);

    return (
        <div className="admin-order-tabs">
            <Tabs style={{itemActiveColor:"rgba(0, 0, 0, 0.88)"}} defaultActiveKey="Pending" onChange={handleTabChange}>
                <TabPane  tab="Pending" key="Pending">
                    <div className="tab-content">
                        {loading ? (
                            <Loader height={100} />
                        ) : (
                            <ul>
                                {orders.map((order) => (
                                    <li key={order._id} onClick={() => handleOrderClick(order._id)}>
                                        Order ID: {order._id} <br /> Total Amount: Rs.{order.totalAmount} <br /> Order Date: {formatDate(order.orderDate)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </TabPane>
                <TabPane tab="Completed" key="Completed">
                    <div className="tab-content">
                        {loading ? (
                            <Loader height={100} />
                        ) : (
                            <ul>
                                {orders.map((order) => (
                                    <li key={order._id} onClick={() => handleOrderClick(order._id)}>
                                        Order ID: {order._id} <br /> Total Amount: Rs.{order.totalAmount} <br /> Order Date: {formatDate(order.orderDate)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </TabPane>
                <TabPane tab="Canceled" key="Canceled">
                    <div className="tab-content">
                        {loading ? (
                            <Loader height={100} />
                        ) : (
                            <ul>
                                {orders.map((order) => (
                                    <li key={order._id} onClick={() => handleOrderClick(order._id)}>
                                        Order ID: {order._id} <br /> Total Amount: Rs.{order.totalAmount} <br /> Order Date: {formatDate(order.orderDate)}

                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default AdminOrderTabs;
