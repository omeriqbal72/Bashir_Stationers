import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/productcard.css';
import { Skeleton } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function ProductCard({ id, images, name, price, company, colors, quantity }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart, error } = useCart();
  const productDetails = {
    _id: id,
    images: Array.isArray(images) ? images : [images],
    name,
    price,
    company,
    quantity,
  }
  const [selectedColor, setSelectedColor] = useState(colors && Array.isArray(colors) && colors.length > 0 ? colors[0] : null);
  const companyColors = ['#d6f1ff', '#fcd9d9', '#f0ecc5'];
  const randomColor = companyColors[Math.floor(Math.random() * companyColors.length)];

  const handlevisitproduct = () => {
    navigate(`/product?id=${encodeURIComponent(id)}`)
  }
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(productDetails, 1, selectedColor)


  }
  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate('/order-summary', { state: { productDetails } });
  }
  useEffect(() => {
    if ((images) || name && price && company) {
      setLoading(false);
    }
  }, [images, name, price, company]);

  return (
    <Skeleton loading={loading} active>
      {!loading && ( // Render the product card only if loading is false

        <div className="product-card" onClick={handlevisitproduct}>
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

            <div className="product-card-purchase-btns">
              {quantity > 0 ? (
                <>
                  <button className="product-card-add-to-cart-btn" onClick={handleAddToCart}>
                    <FontAwesomeIcon icon={faCartPlus} style={{ color: '#ffffff' }} />
                    Add to Cart
                  </button>
                  <button className="product-card-buy-now-btn" onClick={handleBuyNow}>
                    <FontAwesomeIcon icon={faCreditCard} style={{ color: '#000000' }} />
                    Buy Now
                  </button>
                </>
              ) : (
                <button className="product-card-sold-out-btn" disabled>
                  Sold Out
                </button>
              )}
            </div>
          </div>
        </div>

      )}
    </Skeleton>
  );
}

export default ProductCard;
