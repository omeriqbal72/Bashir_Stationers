import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/adminproductcard.css'; // Ensure the new styles for horizontal layout

const AdminProductCard = ({ product, onDelete }) => {
    return (
        <div key={product._id} className="admin-product-card">
            <div className="admin-product-info">
                {product.images && product.images.length > 0 && (
                    <div className="admin-product-image-container">
                        <img
                            src={`http://localhost:8080/${product.images[0]}`} // Show only the first image
                            alt={product.name}
                            className="admin-product-image"
                        />
                    </div>
                )}
                <div className="admin-product-details">
                    <h3>{product.name}</h3>
                    <p>Company: {product.company?.name || 'N/A'}</p>
                    <p>Category: {product.category?.name || 'N/A'}</p>
                    <p>SubCategory: {product.subCategory?.name || 'N/A'}</p>
                    <p>Type: {product.type?.name || 'N/A'}</p>

                </div>
            </div>


            <div className="admin-product-card-stock">         
                <p>{product.price}</p>
            </div>
            <div className="admin-product-card-stock">
              <p>{product.quantity}</p>

            </div>

            <div className="admin-product-actions-buttons">
                <Link to={`/edit-product/${product._id}`}>
                    <button className="admin-product-actions-buttons-btn">Edit</button>
                </Link>
                <button className="admin-product-actions-buttons-btn" onClick={() => onDelete(product)}>Delete</button>
            </div>
        </div>
    );
};

export default AdminProductCard;