import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader.jsx';
import '../../css/reviews/addreviewtab.css';

const AddReviewTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProductsToReview = async () => {
      try {
        const response = await axios.get('/get-unreviewed-products');
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
  //console.log(products)
  if (loading) {
    return <Loader height={60} />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="add-review-tab">
      <h2>Products to Review</h2>
      <div className="add-review-tab-products-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="add-review-tab-product-card">
              <img
                src={`http://localhost:8080/${(product.product.images && product.product.images.length > 0) ? product.product.images[0] : 'uploads/productImages/default-placeholder.png'}`}
                alt={product.name}
              />
              <span style={{ fontWeight: '700', fontSize: '16px' }}>{product.product.name}</span>
              <button
                className="add-review-tab-btn"
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

export default AddReviewTab;
