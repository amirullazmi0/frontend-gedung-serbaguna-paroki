import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { allMutations } from '../data-services/mutations';
import { AllQueriesKeys } from '../data-services/queries';

type MutationApiRequestProps<T, V> = {
  key: keyof typeof allMutations; // Ensure key is one of the keys in allMutations
  params?: any;  // Optional parameters, could be for URL params or request body
  authRequired?: boolean;  // Whether the request requires authentication
  options?: {
    onSuccess?: () => void;
    onError?: () => void;
    onSettled?: () => void;
  };
};

// Axios instance for API requests
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`
  , // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to retrieve the token from cookies
const getAuthToken = () => {
  return Cookies.get('access-token'); // Assuming the token is stored in cookies under 'access-token'
};

const useMutationApiRequest = <T, V>({
  key,
  params,
  authRequired = false,
  options,
}: MutationApiRequestProps<T, V>) => {
  // Fetch the mutation configuration based on the key
  const mutationConfig = allMutations[key]; // Dynamically get mutation config from allMutations

  // Mutation function
  const mutationFn = async (data: V) => {
    // Create the config for Axios, including Authorization header if needed
    const config = authRequired
      ? {
        headers: {
          'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
          Authorization: `Bearer ${getAuthToken()}`, // Add token if authRequired is true
        },
      }
      : {
        headers: {
          'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      };

    const response = await axiosInstance({
      url: mutationConfig.url,  // Use the URL from the mutation config
      method: mutationConfig.method,  // Use the HTTP method (POST, PUT, etc.)
      data,  // Send the data for POST/PUT requests
      ...config,  // Merge custom config with Axios defaults
    });

    return response.data;
  };

  return useMutation<T, Error, V, unknown>({
    mutationFn,
    onSuccess: (data) => {
      // Handle success
      if (options?.onSuccess) {
        options.onSuccess();
      }

      // Optionally refetch queries after successful mutation
      if (mutationConfig.refetchQueries) {
        mutationConfig.refetchQueries.forEach((queryKey: AllQueriesKeys) => {
          console.log('Refetching query:', queryKey);
          // You can use queryClient to refetch or invalidate queries
        });
      }
    },
    onError: (error) => {
      // Handle error
      if (options?.onError) {
        options.onError();
      }
      console.error('Mutation failed:', error);
    },
    onSettled: () => {
      // Handle after mutation is completed (success or error)
      if (options?.onSettled) {
        options.onSettled();
      }
    },
  });
};

export default useMutationApiRequest;
