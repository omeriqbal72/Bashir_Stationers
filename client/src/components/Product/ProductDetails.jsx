import React, {useEffect, useState} from 'react';
import '../../css/productdetails.css'
import ProductQuantity from './ProductQuantity.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard } from '@fortawesome/free-solid-svg-icons';


const ProductDetails = ({data}) => {
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    // Store the product data in the component state when the component mounts
    if (data) {
      setProductDetails(data);
      
    }
  }, [data]);
  console.log(productDetails)

  return (
    <div className="product-details">
      <div className='product-details-subsection'>
        <div className='product-info'>
          <h1>{productDetails.name}</h1>
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
          <p className="price">Rs. 110</p>
        </div>

        <div className='purchase-btns'>
          <button className="add-to-cart-btn">
            <FontAwesomeIcon icon={faCartPlus} style={{ color: "#ffffff" }} />
            Add to Cart
          </button>
          <button className="buy-now-btn">
            <FontAwesomeIcon icon={faCreditCard} style={{ color: "#000000", }} />
            Buy Now
          </button>
        </div>

      </div>


      <div className="product-description">
        <h2>Description</h2>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos, ullam tempore? Error, recusandae sequi!
          Explicabo amet facilis ab similique. Doloremque, velit accusamus odit obcaecati id rem pariatur dolorum
          possimus doloribus facilis quia ex quos aspernatur aperiam sunt adipisci dolores ipsa vel eaque corporis
          ut?</p>
      </div>


    </div>
  );
};

export default ProductDetails;
