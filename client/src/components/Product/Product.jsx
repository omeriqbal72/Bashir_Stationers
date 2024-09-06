import React from 'react';
import ProductImageGallery from './ProductImageGallery';
import ProductDetails from './ProductDetails';
import '../../css/product.css';

const Product = () => {
  return (
    <div className="product">
      <div className="left-section">
        <ProductImageGallery />
      </div>
      <div className="right-section">
        <ProductDetails />
      </div>
    </div>
  );
};

export default Product;
