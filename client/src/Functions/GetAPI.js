import axios from 'axios';
import { useEffect, useState } from 'react';

export const getAllProducts = (url) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        setError(true);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only call the API if the URL is provided
    if (url) {
      fetchProducts();
    }
  }, [url]);

  return { products, error, loading };
};
