import React from 'react';
import { useParams } from 'react-router-dom';
import ProductImageGallery from './ProductImageGallery';
import ProductDetails from './ProductDetails';
import {useGetProducts} from '../../Functions/useGetProducts.jsx';
import '../../css/product.css';


const Product = () => {

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const url = `/product/${encodeURIComponent(id)}`;
  //console.log(url)
  const { products, error, loading } = useGetProducts(url);
  console.log(products)
  
  
  return (
    <>
      {error && <h1>Something Went Wrong</h1>}
      {loading && <h1>Loading.....</h1>}
      {!loading && products && (
        <div className="product">
          <div className="left-section">
            <ProductImageGallery images={products.images} />
          </div>
          <div className="right-section">
            <ProductDetails data={products} />
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
