import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductImageGallery from './ProductImageGallery';
import ProductDetails from './ProductDetails';
import LineSpacer from './LineSpacer.jsx';
import SimilarProductSlider from './SimilarProductsSlider.jsx'
import { useGetProductDetails } from '../../Functions/GetAPI.js';
import '../../css/product.css';



const Product = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  //console.log(id);
  const { data: product, isLoading, isError, error } = useGetProductDetails(id);

  if (isLoading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (isError) {
    return <div>Error: {error.message}</div>; // Display error state
  }

  if (!product) {
    return <div>No product found</div>; // Handle case where product is not found
  }

  return (
    <>
      <div className="product">
        <div className="left-section">
          <ProductImageGallery images={product.images} />
        </div>
        <div className="right-section">
          <ProductDetails data={product} />
        </div>
      </div>
      
      <LineSpacer />

      <div className="product-description">
        <h2>Description</h2>
        <p>{product.description || 'No description available'}</p>
      </div>

      <div className="slider-section">
        <h2>You may also like</h2>
        <div className="similar-products-slider-container">
          <SimilarProductSlider />
        </div>
      </div>
    </>
  );
}


export default Product;
