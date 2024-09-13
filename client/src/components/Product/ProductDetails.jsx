import React, { useEffect, useState } from 'react';
import '../../css/productdetails.css';
import ProductQuantity from './ProductQuantity.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard, faStar, faPencil, faLayerGroup } from '@fortawesome/free-solid-svg-icons';


const ProductDetails = ({ data }) => {
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    if (data) {
      setProductDetails(data);
    }
  }, [data]);
  console.log(productDetails)

  if (!productDetails) {
    return <div>Loading product details...</div>;
  }

 
  return (
    <>
      <div className="product-details">
        <h1 className="product-name">
          {productDetails.name || 'No Name Available'}
        </h1>

        <div className='product-info'>

          <div className="rating">
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B", }} />
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B", }} />
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B", }} />
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B", }} />
            <span>(437 reviews)</span>
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
                    style={{ backgroundColor: color }}  // Apply inline styling to set background color
                  ></span>
                ))}
              </div>
            </div>
          )}

          <ProductQuantity />

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



      </div>
    </>
  );
};

export default ProductDetails;
