import React, { useState, useEffect } from 'react';
import '../../css/productlisting.css';
import { useLocation } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard.jsx';
import { getAllProducts } from '../../Functions/GetAPI.js'; // Assuming correct import path

function ProductListing() {
    const [url, setUrl] = useState('');
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const subcategory = queryParams.get('subcategory');

    // Set URL based on category or subcategory (avoid unnecessary re-renders)
    useEffect(() => {
        let newUrl = '';
        if (category) {
            newUrl = `/products/category/${encodeURIComponent(category)}`;
        } else if (subcategory) {
            newUrl = `/products/subcategory/${encodeURIComponent(subcategory)}`;
        } else {
            newUrl = '/get-products';
        }

        if (url !== newUrl) {
            setUrl(newUrl);
        }
    }, [category, subcategory]); // Only re-run when category or subcategory changes

    const { products, error, loading } = getAllProducts(url);

    return (
        <div className="product-list">
            {error && <h1>Something Went Wrong</h1>}
            {loading && <h1>Loading.....</h1>}
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