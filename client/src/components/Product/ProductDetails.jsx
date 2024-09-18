import React, { useEffect, useState } from 'react';
import '../../css/productdetails.css';
import { Link } from 'react-router-dom';
import ProductQuantity from './ProductQuantity.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard, faStar, faPencil, faLayerGroup } from '@fortawesome/free-solid-svg-icons';


const ProductDetails = ({ data }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (data) {
      setProductDetails(data);
    }
  }, [data]);
  //console.log(productDetails)

  if (!productDetails) {
    return <div>Loading product details...</div>;
  }

  const handleAddToCart = () => {
    // Assuming productDetails has all the required information about the product
    addToCart(productDetails, quantity);
  };

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

          <div className='product-quantity'>
            <span>Quantity: </span>
            <ProductQuantity
            quantity={quantity}
            onIncrement={() => setQuantity((prev) => prev + 1)}
            onDecrement={() => quantity > 1 && setQuantity((prev) => prev - 1)}
          />
          </div>

        </div>

        <div className='purchase-btns'>
          <Link to={'/mycart'}>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <FontAwesomeIcon icon={faCartPlus} style={{ color: "#ffffff" }} />
              Add to Cart
            </button>
          </Link>

          <button className="buy-now-btn">
            <FontAwesomeIcon icon={faCreditCard} style={{ color: "#000000" }} />
            Buy Now
          </button>
        </div>

      </div>


    </>
  );
};

export default ProductDetails;
