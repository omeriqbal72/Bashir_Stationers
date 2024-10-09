import React, { useEffect, useState } from 'react';
import '../../css/productdetails.css';
import { Link } from 'react-router-dom';
import ProductQuantity from './ProductQuantity.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard, faStar, faPencil, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { Rate } from 'antd'
import axios from 'axios'

const ProductDetails = ({ data, rating }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart , error } = useCart();
  const [productRating, setRating] = useState(5);
  const [ratingCount, setRatingCount] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null); // Track the selected color

  useEffect(() => {
    if (data) {
      setProductDetails(data);
      setRating(data.averageRating || 5);
      setRatingCount(Array.isArray(rating) ? rating.length : 0);
      setSelectedColor(data.colors[0] || null); // Default to the first color
    }
  }, [data, rating]);

  if (!productDetails) {
    return <div>Loading product details...</div>;
  }

  const handleAddToCart = () => {
    addToCart(productDetails, quantity, selectedColor); // Send selectedColor when adding to cart
  };

  const isOutOfStock = productDetails.quantity === 0;

  const handleColorSelect = (color) => {
    setSelectedColor(color); // Set selected color when user clicks on a color option
  };

  return (
    <>
      <div className="product-details">
        <h1 className="product-name">
          {productDetails.name || 'No Name Available'}
        </h1>

        <div className='product-info'>

          <div className="rating">
            <Rate value={productRating} disabled />
            <span>({ratingCount} reviews)</span>
          </div>

          <div className="product-category-and-company">
            <div className="product-category">
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>
                {productDetails.category.name || 'No Name Available'}
              </span>
            </div>

            <div className="product-brand">
              <FontAwesomeIcon icon={faPencil} />
              {productDetails.company.name}
            </div>
          </div>

          <p className="price">Rs. {productDetails.price || 'Price not available'}</p>

          {productDetails.colors.length > 0 && (
            <div className="color-options">
              <h4>Colors</h4>
              <div className="colors">
                {/* Map through the colors array */}
                {productDetails.colors.map((color, index) => (
                  <span
                    key={index}
                    className="color"
                    style={{ 
                      backgroundColor: color, 
                      border: selectedColor === color ? '2px solid #000' : '1px solid #ccc', // Highlight selected color
                      cursor: 'pointer' // Indicate clickable colors
                    }}
                    onClick={() => handleColorSelect(color)} // Handle color selection
                  ></span>
                ))}
              </div>
            </div>
          )}

          {!isOutOfStock && (
            <div className='product-quantity'>
              <span>Quantity: </span>
              <ProductQuantity
                quantity={quantity}
                onIncrement={() => setQuantity((prev) => prev + 1)}
                onDecrement={() => quantity > 1 && setQuantity((prev) => prev - 1)}
              />

              <div>{error}</div>
            </div>
            
          )}
        </div>

        <div className='purchase-btns'>
          {!isOutOfStock ? (
            <>
             
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <FontAwesomeIcon icon={faCartPlus} style={{ color: "#ffffff" }} />
                  Add to Cart
                </button>
              

              <button className="buy-now-btn">
                <FontAwesomeIcon icon={faCreditCard} style={{ color: "#000000" }} />
                Buy Now
              </button>
            </>
          ) : (
            <button className="sold-out-btn" disabled>
              Sold Out
            </button>
          )}  
        </div>

      </div>

    </>
  );
};

export default ProductDetails;
