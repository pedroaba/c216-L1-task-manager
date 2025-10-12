import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/validation';
import { storage } from '@/lib/utils';
import type { AuthState, User } from '@/types/auth';

interface AuthStore extends AuthState {
  // Actions
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Zustand auth store with persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      isAuthenticated: false,
      user: null,
      isLoading: false,

      // Actions
      setToken: (token: string) => {
        set((state) => ({
          ...state,
          token,
          isAuthenticated: true,
        }));
      },

      setUser: (user: User | null) => {
        set((state) => ({
          ...state,
          user,
        }));
      },

      clearAuth: () => {
        // Clear from localStorage
        storage.remove(STORAGE_KEYS.AUTH_TOKEN);
        
        set({
          token: null,
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        
        // Dispatch logout event for interceptors
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
      },

      initializeAuth: () => {
        const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
        
        if (token) {
          set((state) => ({
            ...state,
            token,
            isAuthenticated: true,
          }));
        }
      },

      setLoading: (isLoading: boolean) => {
        set((state) => ({
          ...state,
          isLoading,
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          const value = storage.get(name);
          return value ? JSON.stringify(value) : null;
        },
        setItem: (name: string, value: string) => {
          storage.set(name, JSON.parse(value));
        },
        removeItem: (name: string) => {
          storage.remove(name);
        },
      })),
      // Only persist token and user, not loading states
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// Selectors for common use cases
export const useAuth = () => {
  const store = useAuthStore();
  return {
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    isLoading: store.isLoading,
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    setToken: store.setToken,
    setUser: store.setUser,
    clearAuth: store.clearAuth,
    initializeAuth: store.initializeAuth,
    setLoading: store.setLoading,
  };
};

// Initialize auth on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();
  
  // Listen for logout events from API interceptors
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().clearAuth();
  });
}