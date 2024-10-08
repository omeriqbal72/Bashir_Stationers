import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductImageGallery from './ProductImageGallery';
import ProductDetails from './ProductDetails';
import LineSpacer from './LineSpacer.jsx';
import SimilarProductSlider from './SimilarProductsSlider.jsx'
import { useGetProductDetails , useYouMayLikeProduct } from '../../Functions/GetAPI.js';
import DOMPurify from 'dompurify';
import '../../css/product.css';



const Product = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  //console.log(id);
  const { data: product, isLoading, isError, error } = useGetProductDetails(id);
  const { data: youMayLikeProduct, isLoading: loadingYouMayLike, isError: errorYouMayLike, error: errorYouMayLikeDetails } = useYouMayLikeProduct(id);

  if (isLoading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (isError) {
    return <div>Error: {error.message}</div>; // Display error state
  }

  if (!product) {
    return <div>No product found</div>; // Handle case where product is not found
  }

  const sanitizedDescription = DOMPurify.sanitize(product.description || 'No description available');


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
        <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></div>
      </div>

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
}


export default Product;
