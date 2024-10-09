import { useQuery , useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

// Function to fetch products (queryFn)
const fetchProductDetails = async ({ queryKey }) => {
  const id = queryKey[1];
  const { data } = await axios.get(`/product/${encodeURIComponent(id)}`);
  return data;
};


const fetchProducts = async ({ queryKey, pageParam = 1 }) => {
  const url = queryKey[1]; // Extract the URL from queryKey
  const { data } = await axios.get(`${url}?page=${pageParam}&limit=12`);

  return data;
};

const fetchproductComments = async ({ queryKey }) => {
  const id = queryKey[1];
  const { data } = await axios.get(`/get-comments-products/${encodeURIComponent(id)}`);

  return data;
};

const fetchYouMayLikeProduct = async ({ queryKey }) => {
  const id = queryKey[1];
  const { data } = await axios.get(`/you-may-also-like/${encodeURIComponent(id)}`);
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
      const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;
      
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

export const useYouMayLikeProduct = (id) => {
  return useQuery({
    queryKey: ['you-may-also-like', id], // Changed query key
    queryFn: fetchYouMayLikeProduct,
    enabled: !!id, 
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10,
    retry: 2, 
    refetchOnWindowFocus: false, 
  });
};

export const useGetComments = (id) => {
  return useQuery({
    queryKey: ['product-comments', id], // Changed query key
    queryFn: fetchproductComments,
    enabled: !!id, 
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10,
    retry: 2, 
    refetchOnWindowFocus: false, 
  });
};


// const fetchAdminProductDetails = async ({ queryKey }) => {
//   const id = queryKey[1];
//   const { data } = await axios.get(`/admin/edit-product/${id}`);
//   return data;
// };

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


// export const login = (email, password) => axios.post(API_URL + 'login', { email, password });
// export const signup = (email, password) => axios.post(API_URL + 'register', { email, password });
// export const verifyEmail = (code) => axios.post(API_URL + 'verify-email', { code });