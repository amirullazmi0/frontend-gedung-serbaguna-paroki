import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Define the types for login and register payload
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

// Axios instance for API requests
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle login API request
const login = async (data: LoginPayload) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data; // Return the response (e.g., token or user data)
};

// Function to handle register API request
const register = async (data: RegisterPayload) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data; // Return the response (e.g., token or user data)
};

// Hook to handle login mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Handle success (e.g., store user data or token in localStorage/cookies)
      console.log('Login successful:', data);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Login failed:', error);
    },
  });
};

// Hook to handle register mutation
export const useRegister = () => {
  return useMutation({
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
