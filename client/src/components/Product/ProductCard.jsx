import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/productcard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard } from '@fortawesome/free-solid-svg-icons';


function ProductCard({ id, images, name, price, company }) {
  
  const companyColors = ['#d6f1ff','#fcd9d9', '#f0ecc5'];  
  // Generate a random color for each product card
  const randomColor = companyColors[Math.floor(Math.random() * companyColors.length)];


  return (
    <Link to={`/product?id=${encodeURIComponent(id)}`}>
      <div className="product-card">
        <div className='product-img'>
          <img
            src={`http://localhost:8080/${images || 'default-placeholder.png'}`}
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
  );
}

export default ProductCard;
