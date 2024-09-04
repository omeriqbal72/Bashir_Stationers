import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanel = () => {
    const [productList, setProductList] = useState([]);
    const [error, setError] = useState('');
    const [needsRefetch, setNeedsRefetch] = useState(true); // Refetch flag

    const handleProductAdded = (newProduct) => {
        console.log(newProduct)
        setProductList(oldProducts => [...oldProducts, newProduct]);
        toast.success('Product added successfully', {
            position: 'bottom-center'
        });
        setNeedsRefetch(true);
    };

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
        <div>
            <h1>Admin Dashboard</h1>
            <ProductForm onProductAdded={handleProductAdded} />
            <ProductList 
                products={productList} 
                onDeleteProduct={handleProductDeleted} 
            />
            <ToastContainer />
        </div>
    );
};

export default AdminPanel;
