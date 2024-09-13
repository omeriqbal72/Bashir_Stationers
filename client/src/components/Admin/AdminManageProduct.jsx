import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';
import AdminProductCard from './AdminProductCard';
import '../../css/adminmanageproduct.css';
import { toast, ToastContainer } from 'react-toastify';
import AdminSideBar from './AdminSideBar';
const AdminManageProduct = () => {
    const [productList, setProductList] = useState([]);
    const [needsRefetch, setNeedsRefetch] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [error, setError] = useState(null);

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

    // Handle product deletion after confirmation
    const handleProductDeleted = async (productId) => {
        try {
            await axios.delete(`/delete-product/${productId}`);
            setProductList(oldProducts => oldProducts.filter(product => product._id !== productId));
            toast.success('Product deleted successfully', {
                position: 'bottom-center'
            });
            setNeedsRefetch(true); // Refetch the product list
        } catch (error) {
            setError('Failed to delete product');
        }
    };

    // Trigger delete confirmation modal
    const handleDelete = (product) => {
        setProductToDelete(product);
        setIsConfirmOpen(true);
    };

    // Confirm delete action after modal confirmation
    const confirmDelete = () => {
        if (productToDelete) {
            handleProductDeleted(productToDelete._id);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="admin-manage-product-container">

            {error && <p className="error-message">{error}</p>}
           
            <div className="admin-manage-product-right">
                {productList.map((product) => (
                    <AdminProductCard
                        key={product._id}
                        product={product}
                        onDelete={handleDelete}
                    />
                ))}
            </div>


            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
            />

            <ToastContainer />
        </div>
    );
};

export default AdminManageProduct;
