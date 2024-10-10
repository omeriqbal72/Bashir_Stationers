import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';

const UnReviewedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProductsToReview = async () => {
      try {
        const response = await axios.get('/get-unreviewd-products');
        setProducts(response.data.unreviewedProducts);
      } catch (error) {
        console.error('Error fetching products to review:', error);
        setError('Failed to fetch products.'); 
      } finally {
        setLoading(false);
      }
    };

    fetchProductsToReview();
  }, []);

  const handleAddReview = async (product) => {
      navigate('/add-review', { state: { product } }); 
    
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <div className="unreviewed-products">
      <h2>Products to Review</h2>
      <div className="unreviewed-products-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="unreviewed-products-card">
              <img src={product.imageUrl || 'placeholder-image-url.jpg'} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Price: ${product.priceAtPurchase}</p>
              <p>Quantity: {product.quantity}</p>
              <button
                className="add-review-button"
                onClick={() => handleAddReview(product.product)} 
              >
                Add Review
              </button>
            </div>
          ))
        ) : (
          <p>No products to review.</p>
        )}
      </div>
    </div>
  );
};

export default UnReviewedProducts;
