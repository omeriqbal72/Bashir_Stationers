import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductImageGallery from './ProductImageGallery';
import ProductDetails from './ProductDetails';
import LineSpacer from './LineSpacer.jsx';
import CommentsSection from './CommentsSection.jsx';
import SimilarProductSlider from './SimilarProductsSlider.jsx'
import { useGetProductDetails, useYouMayLikeProduct, useGetComments } from '../../Functions/GetAPI.js';
import DOMPurify from 'dompurify';
import '../../css/product.css';
import axios from 'axios'; 
import Loader from '../Loader/Loader.jsx';

const Product = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const { data: product, isLoading, isError, error } = useGetProductDetails(id);
  const { data: youMayLikeProduct, isLoading: loadingYouMayLike, isError: errorYouMayLike, error: errorYouMayLikeDetails } = useYouMayLikeProduct(id);
  const { data: commentsReceived, isLoading: commentsLoading, isError: commentError, error: errorComments } = useGetComments(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (isLoading) {
    return <Loader height={100} />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!product) {
    return <div>No product found</div>; 
  }

  const sanitizedDescription = DOMPurify.sanitize(product.description || 'No description available');

  return (
    <>
      <div className="product">
        <div className="left-section">
          <ProductImageGallery images={product.images} />
        </div>
        <div className="right-section">
          <ProductDetails
            data={product}
            rating={commentsReceived}
          />
        </div>
      </div>

      <LineSpacer />

      <div className="product-description">
        <h2>Description</h2>
        <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></div>
      </div>

      <CommentsSection
        comments={commentsReceived}
        isLoading={commentsLoading}
        isError={commentError}
        error={errorComments}
      />

      <div className="similar-products-slider-section">
        <h2>You may also like</h2>
        <div className="similar-products-slider-container">
          <SimilarProductSlider
            products={youMayLikeProduct}
            isLoading={loadingYouMayLike}
            isError={errorYouMayLike}
            error={errorYouMayLikeDetails}
          />
        </div>
      </div>
    </>
  );
};

export default Product;
