import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAuth, useAuthActions } from '@/store/auth-store';
import { authService } from '@/lib/api/auth';
import { ROUTES, ERROR_MESSAGES } from '@/constants/validation';
import { useToast } from './use-toast';
import type { LoginCredentials, RegisterData, User } from '@/types/auth';
import type { ApiError } from '@/types/api';

/**
 * Custom hook for authentication operations
 */
export const useAuthMutations = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setToken, setUser, clearAuth, setLoading } = useAuthActions();
  const { showToast } = useToast();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      return await authService.signIn(credentials);
    },
    onSuccess: (data) => {
      setToken(data.token);
      if (data.user) {
        setUser(data.user);
      }
      showToast({
        title: 'Login realizado com sucesso!',
        type: 'success',
      });
      router.push(ROUTES.DASHBOARD);
    },
    onError: (error: ApiError) => {
      let message = ERROR_MESSAGES.INVALID_CREDENTIALS;
      
      if (error.status === 401) {
        message = ERROR_MESSAGES.INVALID_CREDENTIALS;
      } else if (error.status === 0) {
        message = ERROR_MESSAGES.CONNECTION_ERROR;
      } else if (error.message) {
        message = error.message;
      }
      
      showToast({
        title: 'Erro no login',
        description: message,
        type: 'error',
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: Omit<RegisterData, 'confirmPassword'>) => {
      setLoading(true);
      return await authService.register(userData);
    },
    onSuccess: () => {
      showToast({
        title: 'Conta criada com sucesso!',
        description: 'Faça login para continuar',
        type: 'success',
      });
      router.push(ROUTES.LOGIN);
    },
    onError: (error: ApiError) => {
      let message = ERROR_MESSAGES.SERVER_ERROR;
      
      if (error.status === 409) {
        message = ERROR_MESSAGES.USER_ALREADY_EXISTS;
      } else if (error.status === 0) {
        message = ERROR_MESSAGES.CONNECTION_ERROR;
      } else if (error.message) {
        message = error.message;
      }
      
      showToast({
        title: 'Erro no cadastro',
        description: message, 
        type: 'error',
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.signOut();
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      showToast({
        title: 'Logout realizado com sucesso',
        type: 'success',
      });
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      // Force logout even if API call fails
      clearAuth();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
  };
};

/**
 * Hook for fetching user profile
 */
export const useProfile = () => {
  const { isAuthenticated, token } = useAuth();
  const { setUser } = useAuthActions();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const user = await authService.getProfile();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

/**
 * Hook for checking authentication status
 */
export const useAuthCheck = () => {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();

  const redirectToLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const redirectToDashboard = () => {
    router.push(ROUTES.DASHBOARD);
  };

  const requireAuth = () => {
    if (!isAuthenticated || !token) {
      redirectToLogin();
      return false;
    }
    return true;
  };

  const requireGuest = () => {
    if (isAuthenticated && token) {
      redirectToDashboard();
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    isLoggedIn: isAuthenticated && !!token,
    user,
    requireAuth,
    requireGuest,
    redirectToLogin,
    redirectToDashboard,
  };
};