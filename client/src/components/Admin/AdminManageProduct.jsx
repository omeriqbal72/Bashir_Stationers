import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';
import AdminProductCard from './AdminProductCard';
import '../../css/adminmanageproduct.css';
import { toast, ToastContainer } from 'react-toastify';
import AdminSearchbar from './AdminSearchbar';
import { useGetAllProducts } from '../../Functions/GetAPI.js';
import axiosInstance from '../../utils/axiosInstance.js';

const AdminManageProduct = () => {
    const [searchParams, setSearchParams] = useState({});
    const [searchUrl, setSearchUrl] = useState('/products/all-products'); // Default URL

    const getSearchUrl = () => {
        const { category, subcategory, company, search, product } = searchParams;
        if (category) return `/products/category/${encodeURIComponent(category)}`;
        if (subcategory) return `/products/subcategory/${encodeURIComponent(subcategory)}`;
        if (company) return `/products/company/${encodeURIComponent(company)}`;
        if (search) return `/products/search/${encodeURIComponent(search)}`;
        if (product) return `/products/product/${encodeURIComponent(product)}`;
        return '/products/all-products'; // Base URL
    };

    useEffect(() => {
        const url = getSearchUrl();
        setSearchUrl(url);
    }, [searchParams]);

    const {
        data = { pages: [] },
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGetAllProducts(searchUrl);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [error, setError] = useState(null);

    const handleProductDeleted = async (productId) => {
        try {
            // Retrieve the token from localStorage (or wherever you store the token)
            const token = localStorage.getItem('token');
    
            await axiosInstance.delete(`/delete-product/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                },
            });
    
            toast.success('Product deleted successfully', {
                position: 'bottom-center'
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product');
        }
    };
    
    const handleDelete = (product) => {
        setProductToDelete(product);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            handleProductDeleted(productToDelete._id);
            setIsConfirmOpen(false);
        }
    };

    const handleSearch = (searchParams) => {
        setSearchParams(searchParams);
    };

    return (
        <div className="admin-manage-product-container">
            {error && <p className="error-message">{error}</p>}

            <div className="admin-manage-product-top">
                <h1>Manage Products</h1>
            </div>

            <div className="admin-manage-product-bottom">

                <div className="admin-manage-product-bottoms-search">
                    <AdminSearchbar onSearch={handleSearch} />
                </div>

                <div className="admin-manage-product-bottom-products">
                    {isLoading ? (
                        <p>Loading products...</p>
                    ) : isError ? (
                        <p>Failed to fetch products</p>
                    ) : (
                        <>
                            <div className="admin-manage-product-bottoms-headings">
                                <div className="admin-manage-product-info">
                                    <h3>Product Info</h3>
                                </div>
                                <div className="admin-manage-product-details">
                                    <h3>Price</h3>
                                </div>
                                <div className="admin-manage-product-details">
                                    <h3>Stock</h3>
                                </div>
                                <div className="admin-manage-product-details">
                                    <h3>Actions</h3>
                                </div>


                            </div>
                            {data.pages && data.pages.length > 0 ? (
                                data.pages.map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page.products && page.products.length > 0 ? (
                                            page.products.map((product) => (
                                                <AdminProductCard
                                                    key={product._id}
                                                    product={product}
                                                    onDelete={handleDelete}
                                                />
                                            ))
                                        ) : (
                                            <p>No products found</p>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <p>No products found</p>
                            )}
                        </>
                    )}

                    {hasNextPage && (
                        <div className="admin-manage-product-bottom-products-button">
                            <button
                                disabled={isFetchingNextPage}
                                onClick={() => fetchNextPage()}
                            >
                                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>


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
