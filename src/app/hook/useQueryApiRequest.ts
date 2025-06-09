import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

type QueryApiRequestProps<T> = {
  key: string;
  params?: any;
  withAuth?: boolean;
};

const fetchData = async <T>(url: string, params?: any, withAuth?: boolean): Promise<T> => {
  const token = withAuth ? Cookies.get('access-token') : null;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const response = await axios.get(url, { params, ...config });
  return response.data;
};

const useQueryApiRequest = <T>({ key, params, withAuth = false }: QueryApiRequestProps<T>) => {
  const queryKey = [key, params];

  const queryFn = () => fetchData<T>(`/api/${key}`, params, withAuth);

  return useQuery<T>({
    queryKey,
    queryFn,
  });
};

export default useQueryApiRequest;
