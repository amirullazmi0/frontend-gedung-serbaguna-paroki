import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { GlobalApiResponse } from '../../utils/globalsApiResponse';
import { InferType } from 'yup';
import { loginSchema, registerSchema } from './authConfig';
import Cookies from "js-cookie";
// Define the expected response type for login and register
interface LoginResponse {
  accessToken: string;
  email: string;
  id: string;
  username: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// Axios instance for API requests
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle login API request
const login = async (data: InferType<typeof loginSchema>): Promise<GlobalApiResponse<LoginResponse>> => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data; // Return the response (e.g., token or user data)
};

// Function to handle register API request
const register = async (data: InferType<typeof registerSchema>): Promise<GlobalApiResponse<RegisterResponse>> => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data; // Return the response (e.g., token or user data)
};

// Hook to handle login mutation
export const useLogin = () => {
  return useMutation<GlobalApiResponse<LoginResponse>, Error, InferType<typeof loginSchema>>({
    mutationFn: login,
    onSuccess: (data: GlobalApiResponse<LoginResponse>) => {
      Cookies.set('access-token', data.data?.accessToken ?? '', { expires: 7 });
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Login failed:', error);
    },
  });
};

// Hook to handle register mutation
export const useRegister = () => {
  return useMutation<GlobalApiResponse<RegisterResponse>, Error, InferType<typeof registerSchema>>({
    mutationFn: register,
    onSuccess: (data) => {
      // Handle success (e.g., show success message or redirect to login)
      console.log('Registration successful:', data);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Registration failed:', error);
    },
  });
};
