import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { GlobalApiResponse } from '../../utils/globalsApiResponse';
import { InferType } from 'yup';
import { activationRequestSchema, activationSchema, forgetPasswordSchema, loginSchema, newPasswordSchema, registerSchema } from './authConfig';
import Cookies from "js-cookie";

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

interface activationResponse {
  name: string
  email: string
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const login = async (data: InferType<typeof loginSchema>): Promise<GlobalApiResponse<LoginResponse>> => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

const register = async (data: InferType<typeof registerSchema>): Promise<GlobalApiResponse<RegisterResponse>> => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

const activation = async (data: InferType<typeof activationSchema>): Promise<GlobalApiResponse<activationResponse>> => {
  const response = await axiosInstance.post('/auth/activation', data);
  return response.data;
};

const activationRequest = async (data: InferType<typeof activationRequestSchema>): Promise<GlobalApiResponse<activationResponse>> => {
  const response = await axiosInstance.post('/auth/activation-token-request', data);
  return response.data;
};
const forgetPassword = async (data: InferType<typeof forgetPasswordSchema>): Promise<GlobalApiResponse<any>> => {
  const response = await axiosInstance.post('/auth/forget-password', data);
  return response.data;
};
const newPassword = async (data: InferType<typeof newPasswordSchema>): Promise<GlobalApiResponse<any>> => {
  const response = await axiosInstance.post('/auth/new-password', data);
  return response.data;
};

// Hook to handle login mutation
export const useLogin = () => {
  return useMutation<GlobalApiResponse<LoginResponse>, Error, InferType<typeof loginSchema>>({
    mutationFn: login,
    onSuccess: (data: GlobalApiResponse<LoginResponse>) => {
      Cookies.set('access-token', data.data?.accessToken ?? '', { expires: 7 });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};


export const useRegister = () => {
  return useMutation<GlobalApiResponse<RegisterResponse>, Error, InferType<typeof registerSchema>>({
    mutationFn: register,
    onSuccess: (data) => {
      console.log('Registration successful:', data);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useActivation = () => {
  return useMutation<GlobalApiResponse<activationResponse>, Error, InferType<typeof activationSchema>>({
    mutationFn: activation,
    onSuccess: (data) => {
      console.log('Activation successful:', data);
    },
    onError: (error) => {
      console.error('Activation failed:', error);
    },
  });
};

export const useActivationRequest = () => {
  return useMutation<GlobalApiResponse<activationResponse>, Error, InferType<typeof activationRequestSchema>>({
    mutationFn: activationRequest,
    onSuccess: (data) => {
      console.log('Activation request successful:', data);
    },
    onError: (error) => {
      console.error('Activation request failed:', error);
    },
  });
};

export const useForgetPassword = () => {
  return useMutation<GlobalApiResponse<any>, Error, InferType<typeof forgetPasswordSchema>>({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      console.log('forget password successful:', data);
    },
    onError: (error) => {
      console.error('forget password failed:', error);
    },
  });
};

export const useNewPassword = () => {
  return useMutation<GlobalApiResponse<any>, Error, InferType<typeof newPasswordSchema>>({
    mutationFn: newPassword,
    onSuccess: (data) => {
      console.log('new password successful:', data);
    },
    onError: (error) => {
      console.error('new password failed:', error);
    },
  });
};



