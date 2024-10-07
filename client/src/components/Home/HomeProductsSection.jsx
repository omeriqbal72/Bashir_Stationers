import React, { useEffect, useState } from 'react';
import ProductCard from '../Product/ProductCard.jsx';
import '../../css/homeproductssection.css';
import axios from 'axios';

function HomeProductsSection() {
  const [data, setData] = useState([]); // State to hold the products
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isError, setIsError] = useState(false); // Error state

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/featured-products');
        setData(response.data);
      } catch (error) {
        setIsError(true);
        console.error('Error fetching products:', error.message); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts(); 
  }, []); 

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  // Handling error state
  if (isError) {
    return <div>Error fetching products. Please try again later.</div>; 
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <div className="best-selling-section">
      <h2>Our Top Picks</h2>
      <p>Essential Office Supplies In Our Online Stationery Shop That Keep Your Office Operations Smooth And Efficient</p>
      <div className="product-grid">
        {data.map(product => (
          <ProductCard
            key={product._id}
            id={product._id}
            images={product.images?.[0]}
            name={product.name}
            price={product.price}
            company={product.company?.name}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeProductsSection; 
