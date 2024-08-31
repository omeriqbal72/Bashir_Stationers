import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';
import '../../css/productlist.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const ProductList = ({ refresh }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [imageIndex, setImageIndex] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/get-products');
                setProducts(response.data);
                console.log(response.data)
            } catch (error) {
                setError('Failed to fetch products');
            }
        };

        fetchProducts();
    }, [refresh]); // Re-fetch products whenever refresh changes

    const handleDelete = (product) => {
        setProductToDelete(product);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/delete-product/${productToDelete._id}`);

            setProducts(products.filter(product => product._id !== productToDelete._id));
            setIsConfirmOpen(false);
            toast.success('Product deleted successfully', {
                position: 'bottom-center'
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product');
        }
    };


    const handleImageClick = (productId, direction) => {
        setImageIndex(prev => {
            const currentIndex = prev[productId] || 0;
            const images = products.find(p => p._id === productId).images;
            const newIndex = (currentIndex + direction + images.length) % images.length;
            return { ...prev, [productId]: newIndex };
        });
    };

    return (
        <div className="product-list-container">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {products.map(product => {
                const currentIndex = imageIndex[product._id] || 0;

                return (
                    <div key={product._id} className="product-card">
                        {product.images && product.images.length > 0 && (
                            <div className="image-slider">
                                <button
                                    className="slider-button left"
                                    onClick={() => handleImageClick(product._id, -1)}
                                >
                                    ‹
                                </button>
                                <img
                                    src={`http://localhost:8080/${product.images[currentIndex]}`}
                                    alt={`${product.name} ${currentIndex + 1}`}
                                    className="active"
                                />
                                <button
                                    className="slider-button right"
                                    onClick={() => handleImageClick(product._id, 1)}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                        <div className="product-card-content">
                            <h3>{product.name}</h3>
                            <p>Company: {product.company?.name || 'N/A'}</p>
                            <p>Category: {product.category?.name || 'N/A'}</p>
                            <p>SubCategory: {product.subCategory?.name || 'N/A'}</p>
                            <p>Type: {product.type?.name || 'N/A'}</p>

                            <p>Price: {product.price}</p>
                            <Link to={`/edit-product/${product._id}`}>
                                <button>Edit</button>
                            </Link>
                            <button onClick={() => handleDelete(product)}>Delete</button>
                        </div>
                    </div>
                );
            })}

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
            />
            <ToastContainer />
        </div>
    );
};

export default ProductList;
