import React from 'react';
import '../../css/productlisting.css';
import { useLocation } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard.jsx';
import { useGetAllProducts } from '../../Functions/GetAPI.js'; // Updated import path


function ProductListing() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const subcategory = queryParams.get('subcategory');
  const company = queryParams.get('company');
  const type = queryParams.get('type');
  const search = queryParams.get('search');
  const product = queryParams.get('product');

  // Build URL dynamically based on query params
  const url = React.useMemo(() => {
    if (category) return `/products/category/${encodeURIComponent(category)}`;
    if (subcategory) return `/products/subcategory/${encodeURIComponent(subcategory)}`;
    if (company) return `/products/company/${encodeURIComponent(company)}`;
    if (type) return `/products/type/${encodeURIComponent(type)}`;
    if (search) return `/products/search/${encodeURIComponent(search)}`;
    if (product) return `/products/product/${encodeURIComponent(product)}`;
    return '/get-products';
  }, [category, subcategory, company, type, search, product]);

  // Fetch products using React Query (uses queryKey as ['products', url])
  const { data: products = [], error, isLoading } = useGetAllProducts(url);

  return (
    <div className="product-list">
      {error && <h1>Something Went Wrong</h1>}
      {isLoading && <h1>Loading.....</h1>}
      <h3>Search Results ({products.length})</h3>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            images={product.images[0]} // Ensure correct image URL from API data
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );

}

export default ProductListing;