import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/productcard.css';
import { Skeleton } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard } from '@fortawesome/free-solid-svg-icons';

function ProductCard({ id, images, name, price, company }) {
  const [loading, setLoading] = useState(true); // Add loading state

  const companyColors = ['#d6f1ff', '#fcd9d9', '#f0ecc5'];
  const randomColor = companyColors[Math.floor(Math.random() * companyColors.length)];

  useEffect(() => {
    // Simulate a delay for loading (optional) or check if data exists
    if ((images) || name && price && company) {
      setLoading(false); // Data is ready, stop loading
    }
  }, [images, name, price, company]); // Run this effect when these props change

  return (
    <Skeleton loading={loading} active>
      {!loading && ( // Render the product card only if loading is false
        <Link to={`/product?id=${encodeURIComponent(id)}`}>
          <div className="product-card">
            <div className='product-img'>
              <img
                src={`http://localhost:8080/${images || 'uploads/productImages/default-placeholder.png'}`}
                alt={name}
              />
            </div>

            <div className='product-card-info'>
              <p className='product-title'>{name}</p>
              <div className='product-company'>
                <p className='product-company-name' style={{ backgroundColor: randomColor }}>{company}</p>
              </div>
              <p className='product-price'>Rs.{price}</p>

              <div className='product-card-purchase-btns'>
                <button className="product-card-add-to-cart-btn">
                  <FontAwesomeIcon icon={faCartPlus} style={{ color: "#ffffff" }} />
                  Add to Cart
                </button>
                <button className="product-card-buy-now-btn">
                  <FontAwesomeIcon icon={faCreditCard} style={{ color: "#000000" }} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </Link>
      )}
    </Skeleton>
  );
}

export default ProductCard;
