import { create } from 'zustand';
import { generateId } from '@/lib/utils';
import { TOAST_CONFIG } from '@/constants/validation';
import type { Toast, ToastState } from '@/types/auth';

/**
 * Toast store for global toast notifications
 */
const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      id: generateId(),
      duration: TOAST_CONFIG.DEFAULT_DURATION,
      ...toast,
      duration: toast.type === 'error' 
        ? TOAST_CONFIG.ERROR_DURATION 
        : toast.type === 'success'
        ? TOAST_CONFIG.SUCCESS_DURATION
        : toast.duration || TOAST_CONFIG.DEFAULT_DURATION,
    };

    set((state) => {
      const toasts = [...state.toasts, newToast];
      
      // Limit number of toasts
      if (toasts.length > TOAST_CONFIG.MAX_TOASTS) {
        return { toasts: toasts.slice(-TOAST_CONFIG.MAX_TOASTS) };
      }
      
      return { toasts };
    });

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(newToast.id);
      }, newToast.duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

/**
 * Custom hook for toast notifications
 */
export const useToast = () => {
  const { toasts, addToast, removeToast, clearToasts } = useToastStore();

  const showToast = (toast: Omit<Toast, 'id'>) => {
    addToast(toast);
  };

  const showSuccessToast = (title: string, description?: string) => {
    showToast({ title, description, type: 'success' });
  };

  const showErrorToast = (title: string, description?: string) => {
    showToast({ title, description, type: 'error' });
  };

  const showWarningToast = (title: string, description?: string) => {
    showToast({ title, description, type: 'warning' });
  };

  const showInfoToast = (title: string, description?: string) => {
    showToast({ title, description, type: 'info' });
  };

  return {
    toasts,
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    removeToast,
    clearToasts,
  };
};