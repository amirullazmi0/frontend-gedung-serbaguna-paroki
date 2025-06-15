import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { allQueries } from '../data-services/queries';

// Axios instance (reuse if needed across your app)
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

type QueryApiRequestProps<T> = {
  key: keyof typeof allQueries;
  params?: any;
  withAuth?: boolean;
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>;
};

const getToken = () => Cookies.get('access-token');

const useQueryApiRequest = <T>({
  key,
  params,
  withAuth = false,
  options,
}: QueryApiRequestProps<T>) => {
  const queryKey = [key, params];

  const queryFn = async (): Promise<T> => {
    const token = getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (withAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = allQueries[key];

    const response = await axiosInstance.get(url, {
      params,
      headers,
    });

    return response.data;
  };

  return useQuery<T, Error>({
    queryKey,
    queryFn,
    ...options,
  });
};

export default useQueryApiRequest;
