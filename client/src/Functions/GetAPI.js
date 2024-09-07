import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Function to fetch products (queryFn)
const fetchProducts = async ({ queryKey }) => {
  const url = queryKey[1];
  const { data } = await axios.get(url);
  return data;
};

// React Query hook for fetching products
export const useGetAllProducts = (url) => {
  const queryKey = ['products', url]; // Define query key

  // Use useQuery hook
  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: fetchProducts,
    enabled: !!url, // Fetch only if URL is valid
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    retry: 2, // Retry failed requests up to 2 times
    refetchOnWindowFocus: false, // Do not refetch on window focus
  });

  // Return data, loading state, and error information
  return { data, isLoading, isError, error };
};
