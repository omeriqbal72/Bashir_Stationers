import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetProducts = (url) => {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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

    if (url) {
      fetchProducts();
    }
  }, [url]);

  return { products, error, loading };
};

