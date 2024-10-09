// src/context/OrderContext.jsx
import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import publicAxiosInstance from '../utils/publicAxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext.jsx';

const OrderContext = createContext();

export const useOrder = () => {
    return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
    const [orderError, setOrderError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const [singleOrder, setSingleOrder] = useState(null);
    const { user } = useUserContext();

    const placeOrder = async (cart, address, paymentMethod, contactNumber, emailAddress) => {
        setLoading(true); // Set loading to true before the process starts
        setOrderError(null); // Reset any previous errors
        if (user) {
            try {
                const orderDetails = {
                    cart,
                    address,
                    paymentMethod,
                    contactNumber,
                    emailAddress,
                };

                // Navigate immediately without waiting for the response
                navigate('/myorders');

                // Perform the order request asynchronously
                const response = await axiosInstance.post('/order/placeorder', orderDetails);
                console.log('Order placed:', response.data);
            } catch (err) {
                console.error('Error placing order:', err);
                setOrderError('Failed to place order.');
            } finally {
                setLoading(false); // Set loading to false after completion
            }
        } else {
            try {
                // Navigate to the verification code input page
                navigate('/enter-order-code', { state: { emailAddress } });

                const response = await publicAxiosInstance.post('/order/verify', {
                    cart,
                    address,
                    paymentMethod,
                    contactNumber,
                    emailAddress,
                });
                console.log('Verification code sent:', response.data);
            } catch (err) {
                console.error('Error sending verification code:', err);
                setOrderError('Failed to send verification code.');
            } finally {
                setLoading(false); // Set loading to false after completion
            }
        }
    };

    const fetchUserOrders = async () => {
        setLoading(true); // Set loading to true before fetching orders
        setOrderError(null); // Reset any previous errors
        try {
            const response = await axiosInstance.get('/order/myorders');
            setOrders(response.data); // Set the orders state with the fetched data
        } catch (err) {
            console.error('Error fetching orders:', err);
            setOrderError('Failed to fetch orders.');
        } finally {
            setLoading(false); // Set loading to false after fetching orders
        }
    };

    const getSingleOrderById = async (id) => {
        setLoading(true);
        setOrderError(null);
        try {
            const response = await axiosInstance.get(`/order-by-id/${id}`);
            setSingleOrder(response.data); // Set the singleOrder state with the fetched data
        } catch (err) {
            console.error('Error fetching order:', err);
            setOrderError('Failed to fetch order.');
        } finally {
            setLoading(false);
        }
    };


    const value = {
        placeOrder,
        fetchUserOrders,
        getSingleOrderById,
        singleOrder,
        orders,
        orderError,
        loading 
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};
