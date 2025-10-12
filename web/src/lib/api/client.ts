import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { env } from '@/env';
import { HTTP_STATUS, STORAGE_KEYS, ERROR_MESSAGES } from '@/constants/validation';
import { storage } from '@/lib/utils';
import type { ApiResponse, ApiError } from '@/types/api';

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add timestamp for debugging
      if (env.NEXT_PUBLIC_APP_ENV === 'development') {
        config.headers['X-Request-Time'] = new Date().toISOString();
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for global error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Extract data from successful responses
      return response;
    },
    (error: AxiosError) => {
      const apiError: ApiError = {
        message: ERROR_MESSAGES.SERVER_ERROR,
        status: error.response?.status || 0,
      };

      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        switch (status) {
          case HTTP_STATUS.BAD_REQUEST:
            apiError.message = ERROR_MESSAGES.SERVER_ERROR;
            if (data && typeof data === 'object' && 'errors' in data) {
              apiError.errors = data.errors as Record<string, string[]>;
            }
            break;
            
          case HTTP_STATUS.UNAUTHORIZED:
            apiError.message = ERROR_MESSAGES.UNAUTHORIZED;
            // Clear token on 401 response
            storage.remove(STORAGE_KEYS.AUTH_TOKEN);
            // Redirect to login page (handled by auth store)
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:logout'));
            }
            break;
            
          case HTTP_STATUS.FORBIDDEN:
            apiError.message = ERROR_MESSAGES.UNAUTHORIZED;
            break;
            
          case HTTP_STATUS.NOT_FOUND:
            apiError.message = 'Recurso não encontrado';
            break;
            
          case HTTP_STATUS.CONFLICT:
            apiError.message = ERROR_MESSAGES.USER_ALREADY_EXISTS;
            break;
            
          case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          default:
            apiError.message = ERROR_MESSAGES.SERVER_ERROR;
            break;
        }
      } else if (error.request) {
        // Network error
        apiError.message = ERROR_MESSAGES.CONNECTION_ERROR;
        apiError.status = 0;
      } else {
        // Something else happened
        apiError.message = error.message || ERROR_MESSAGES.SERVER_ERROR;
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

// Create the API client instance
export const apiClient = createApiClient();

// Generic API request wrapper
export async function apiRequest<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  config?: any
): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      method,
      url,
      data,
      ...config,
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Utility functions for different HTTP methods
export const api = {
  get: <T = any>(url: string, config?: any) => 
    apiRequest<T>('GET', url, undefined, config),
    
  post: <T = any>(url: string, data?: any, config?: any) => 
    apiRequest<T>('POST', url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: any) => 
    apiRequest<T>('PUT', url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: any) => 
    apiRequest<T>('PATCH', url, data, config),
    
  delete: <T = any>(url: string, config?: any) => 
    apiRequest<T>('DELETE', url, undefined, config),
};

export default apiClient;