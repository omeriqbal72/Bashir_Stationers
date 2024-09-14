import { useQuery , useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

// Function to fetch products (queryFn)
const fetchProductDetails = async ({ queryKey }) => {
  const id = queryKey[1];
  const { data } = await axios.get(`/product/${encodeURIComponent(id)}`);
  return data;
};

// const fetchAdminProductDetails = async ({ queryKey }) => {
//   const id = queryKey[1];
//   const { data } = await axios.get(`/admin/edit-product/${id}`);
//   return data;
// };


const fetchProducts = async ({ queryKey, pageParam = 1 }) => {
  const url = queryKey[1]; // Extract the URL from queryKey
  const { data } = await axios.get(`${url}?page=${pageParam}&limit=12`);

  return data;
};

// Custom hook using useInfiniteQuery for paginated fetching
export const useGetAllProducts = (url) => {
  const queryKey = ['products', url]; 

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: fetchProducts,
    enabled: !!url, 
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage;
      //console.log(`Current Page: ${currentPage}, Total Pages: ${totalPages}`);

      const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;
      //console.log(`Next page to fetch: ${nextPage}`);
      return nextPage;
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};


// Custom hook for fetching product details
export const useGetProductDetails = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: fetchProductDetails,
    enabled: !!id, 
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10,
    retry: 2, 
    refetchOnWindowFocus: false, 
  });
};

// export const adminProductDetails = (id) => {
//   return useQuery({
//     queryKey: ['product', id],
//     queryFn: fetchAdminProductDetails,
//     enabled: !!id, // Fetch only if ID is valid
//     staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
//     cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
//     retry: 2, // Retry failed requests up to 2 times
//     refetchOnWindowFocus: false, // Do not refetch on window focus
//   });
// };