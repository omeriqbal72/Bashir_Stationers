import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSideBar from './AdminSideBar';
import '../../css/adminpanel.css'

const AdminPanel = () => {
    const [productList, setProductList] = useState([]);
    const [error, setError] = useState('');
    const [needsRefetch, setNeedsRefetch] = useState(true); // Refetch flag

    const handleProductDeleted = async (productId) => {
        try {
            await axios.delete(`/delete-product/${productId}`);
            setProductList(oldProducts => oldProducts.filter(product => product._id !== productId));
            toast.success('Product deleted successfully', {
                position: 'bottom-center'
            });
            setNeedsRefetch(true);
        } catch (error) {
            setError('Failed to delete product');
        }
    };

    useEffect(() => {
        if (needsRefetch) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get('/get-products');
                    setProductList(response.data);
                    setNeedsRefetch(false);
                } catch (error) {
                    setError('Failed to fetch products');
                }
            };

            fetchProducts();
        }
    }, [needsRefetch]);

    return (
        <div className="admin-panel-container">

            <div className="admin-panel-right">
                <h1>Admin Dashboard</h1>
                
            </div>

        </div>
    );
};

export default AdminPanel;
