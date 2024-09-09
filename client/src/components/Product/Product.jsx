import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductImageGallery from './ProductImageGallery';
import ProductDetails from './ProductDetails';
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
    <div className="product">
      <div className="left-section">
        <ProductImageGallery images={product.images} />
      </div>
      <div className="right-section">
        <ProductDetails data={product} />
      </div>
    </div>
  );
}

export default Product;
