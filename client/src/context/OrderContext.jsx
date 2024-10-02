// src/context/OrderContext.jsx
import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Your Axios config
import { useNavigate } from 'react-router-dom';

const OrderContext = createContext();

export const useOrder = () => {
    return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
    const [orderError, setOrderError] = useState(null);
    const [orders, setOrders] = useState([]); // State to hold orders
    const navigate = useNavigate();

    const placeOrder = async (cart, address, paymentMethod) => {
        try {
            const orderDetails = {
                cart,
                address,
                paymentMethod,
            };

            const response = await axiosInstance.post('/order/placeorder', orderDetails);
            console.log('Order placed:', response.data);
            navigate('/myorders'); // Navigate to orders page
        } catch (err) {
            console.error('Error placing order:', err);
            setOrderError('Failed to place order.');
        }
    };

    const fetchUserOrders = async () => {
        try {
            const response = await axiosInstance.get('/order/myorders');
            setOrders(response.data); // Set the orders state
        } catch (err) {
            console.error('Error fetching orders:', err);
            setOrderError('Failed to fetch orders.');
        }
    };

    const value = {
        placeOrder,
        fetchUserOrders,
        orders,
        orderError,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};
