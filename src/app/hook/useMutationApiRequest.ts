import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { allMutations } from '../data-services/mutations';
import { AllQueriesKeys } from '../data-services/queries';

type MutationApiRequestProps<T, V> = {
  key: keyof typeof allMutations;
  params?: any;
  authRequired?: boolean;
  options?: {
    onSuccess?: (data?: T) => void;
    onError?: (error?: Error) => void;
    onSettled?: () => void;
  };
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

// Get token from cookies
const getAuthToken = () => Cookies.get('access-token');

const useMutationApiRequest = <T, V>({
  key,
  params,
  authRequired = false,
  options,
}: MutationApiRequestProps<T, V>) => {
  const mutationConfig = allMutations[key];

  const mutationFn = async (data: V): Promise<T> => {
    const isFormData = data instanceof FormData;

    // Conditionally build headers
    const headers: Record<string, string> = {};
    if (isFormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    if (authRequired) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await axiosInstance({
      url: mutationConfig.url,
      method: mutationConfig.method,
      data,
      headers, // Let Axios handle JSON if not FormData
      params, // optional query params
    });

    return response.data;
  };

  return useMutation<T, Error, V>({
    mutationFn,
    onSuccess: (data) => {
      if (options?.onSuccess) options.onSuccess(data);

      if (mutationConfig.refetchQueries) {
        mutationConfig.refetchQueries.forEach((queryKey: AllQueriesKeys) => {
          console.log('Refetching query:', queryKey);
          // Optionally refetch queries using queryClient
        });
      }
    },
    onError: (error) => {
      if (options?.onError) options.onError(error);
      console.error('Mutation failed:', error);
    },
    onSettled: () => {
      if (options?.onSettled) options.onSettled();
    },
  });
};

export default useMutationApiRequest;
