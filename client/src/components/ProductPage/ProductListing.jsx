import React, { useMemo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../Product/ProductCard.jsx';
import ProductsFilterBar from './ProductsFilterBar.jsx';
import { useGetAllProducts } from '../../Functions/GetAPI.js';
import { useInView } from 'react-intersection-observer';
import Loader from '../Loader/Loader.jsx';
import '../../css/productlisting.css';

function ProductListing() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const subcategory = queryParams.get('subcategory');
  const company = queryParams.get('company');
  const type = queryParams.get('type');
  const search = queryParams.get('search');
  const product = queryParams.get('product');

  const [brandFilter, setBrandFilter] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);

  // Constructing the base URL
  const url = useMemo(() => {
    if (category) return `/products/category/${encodeURIComponent(category)}`;
    if (subcategory) return `/products/subcategory/${encodeURIComponent(subcategory)}`;
    if (company) return `/products/company/${encodeURIComponent(company)}`;
    if (type) return `/products/type/${encodeURIComponent(type)}`;
    if (search) return `/products/search/${encodeURIComponent(search)}`;
    if (product) return `/products/product/${encodeURIComponent(product)}`;
    return '/products/all-products'; // Base URL without page and limit
  }, [category, subcategory, company, type, search, product]);

  // Fetch products using useInfiniteQuery
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetAllProducts(url);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <Loader height={100} />;
  if (isError) return <h1>Something Went Wrong: {error.message}</h1>;

  let totalProducts = data?.pages?.flatMap(page => page.totalProducts) || [0];
  totalProducts = totalProducts[0];
  //console.log(totalProducts);

  const fetchedProducts = data?.pages?.flatMap(page => page.products) || [];

  const filterProducts = (products) => {
    return products.filter(product => {

      if (product.company) {
        const productBrand = product.company.name.toLowerCase();
        const filterBrand = brandFilter ? brandFilter.toLowerCase() : null;

        // Filter by brand
        if (filterBrand && productBrand !== filterBrand) {
          return false;
        }

        // Filter by price
        if (priceFilter) {
          const [minPrice, maxPrice] = priceFilter.split('-').map(Number);
          if (product.price < minPrice || product.price > maxPrice) {
            return false;
          }
        }
      }


      return true;
    });
  };

  const products = filterProducts(fetchedProducts);

  return (
    <>
      <div className="product-list">

        <div className='product-filter-section'>
          <ProductsFilterBar total={totalProducts} length={products.length} onBrandChange={setBrandFilter}
            onPriceChange={setPriceFilter} />
        </div>

        <div className="product-grid">
          {products.length > 0 ? (
            products.map(product => {
              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  images={product.images?.[0]}
                  name={product.name}
                  price={product.price}
                  company={product.company.name}
                />
              );
            })
          ) : (
            <p>No products found</p>
          )}
        </div>

        <div ref={ref} style={{ height: '100px', backgroundColor: 'transparent' }}>
          {isFetchingNextPage && <Loader height={5} />}
        </div>
      </div>

    </>

  );
}

export default ProductListing;
