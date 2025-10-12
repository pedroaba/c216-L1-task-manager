import { api } from './client';
import { API_ENDPOINTS } from '@/constants/validation';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User 
} from '@/types/auth';

/**
 * Authentication API service functions
 */
export const authApi = {
  /**
   * Sign in user with email and password
   */
  signIn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGN_IN,
      credentials
    );
    return response;
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.AUTH.SIGN_OUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Sign out API call failed:', error);
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.AUTH.PROFILE);
    return response;
  },

  /**
   * Refresh authentication token
   */
  refresh: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
    return response;
  },
};

/**
 * User management API service functions
 */
export const userApi = {
  /**
   * Register new user
   */
  register: async (userData: Omit<RegisterData, 'confirmPassword'>): Promise<{ userId: string }> => {
    const response = await api.post<{ userId: string }>(
      API_ENDPOINTS.USERS.REGISTER,
      userData
    );
    return response;
  },

  /**
   * Get user profile by ID
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.USERS.PROFILE);
    return response;
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(API_ENDPOINTS.USERS.PROFILE, userData);
    return response;
  },
};

// Combined auth service export
export const authService = {
  ...authApi,
  ...userApi,
};