import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal'; // Import the confirmation modal
import '../css/productlist.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast
import { Link } from 'react-router-dom'; // Import Link for navigation

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [imageIndex, setImageIndex] = useState({}); // Track image index for each product


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/get-products');
                setProducts(response.data);
                console.log(response.data);
            } catch (error) {
                setError('Failed to fetch products');
            }
        };

        fetchProducts();
    }, []);

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
                position: 'bottom-center' // Use the string directly
            });
        } catch (error) {
            console.error('Error deleting product:', error); // Log the error for debugging
            setError('Failed to delete product'); // Set error message to be displayed
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
                            <p>Company: {product.company.name}</p>
                            <p>Categories: {product.categories.map(category => category.name).join(', ')}</p>
                            <p>Type: {product.type.name}</p>
                            
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
