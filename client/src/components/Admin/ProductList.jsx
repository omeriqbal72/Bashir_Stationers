import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import '../../css/productlist.css';
import { Link } from 'react-router-dom';

const ProductList = ({ products, onDeleteProduct }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [imageIndex, setImageIndex] = useState({});

    const handleDelete = (product) => {
        setProductToDelete(product);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            onDeleteProduct(productToDelete._id);
            setIsConfirmOpen(false);      
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
            {products.map(product => {
                const currentIndex = imageIndex[product._id] || 0;

                return (
                    <div key={product._id} className="product-list-card">
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
            
        </div>
    );
};

export default ProductList;
