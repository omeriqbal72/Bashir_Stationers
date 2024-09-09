import React, { useEffect, useState } from 'react';
import '../../css/productdetails.css';
import ProductQuantity from './ProductQuantity.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard } from '@fortawesome/free-solid-svg-icons';

const ProductDetails = ({ data }) => {
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    // Store the product data in the component state when the component mounts
    if (data) {
      setProductDetails(data);
    }
  }, [data]);

  if (!productDetails) {
    // Return null or a loading placeholder if productDetails hasn't been set yet
    return <div>Loading product details...</div>;
  }

  return (
    <div className="product-details">
      <div className='product-details-subsection'>
        <div className='product-info'>
          {/* Safe access to product details */}
          <h1>{productDetails.name || 'No Name Available'}</h1>
          <div className="rating">⭐⭐⭐⭐ (437 reviews)</div>

          <div className="color-options">
            <h4>Colors</h4>
            <div className="colors">
              <span className="color black"></span>
              <span className="color grey"></span>
              <span className="color orange"></span>
            </div>
          </div>

          <ProductQuantity />
          <p className="price">Rs. {productDetails.price || 'Price not available'}</p>
        </div>

        <div className='purchase-btns'>
          <button className="add-to-cart-btn">
            <FontAwesomeIcon icon={faCartPlus} style={{ color: "#ffffff" }} />
            Add to Cart
          </button>
          <button className="buy-now-btn">
            <FontAwesomeIcon icon={faCreditCard} style={{ color: "#000000" }} />
            Buy Now
          </button>
        </div>
      </div>

      <div className="product-description">
        <h2>Description</h2>
        <p>{productDetails.description || 'No description available'}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
