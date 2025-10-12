import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format error messages for display
 */
export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unexpected error occurred';
}

/**
 * Generate unique ID for components
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Debounce function for input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if code is running on client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Local storage utilities with SSR safety
 */
export const storage = {
  get: (key: string, fallback?: any) => {
    if (!isClient) return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  
  set: (key: string, value: any) => {
    if (!isClient) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail in SSR or if localStorage is not available
    }
  },
  
  remove: (key: string) => {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail in SSR or if localStorage is not available
    }
  },
  
  clear: () => {
    if (!isClient) return;
    try {
      localStorage.clear();
    } catch {
      // Silently fail in SSR or if localStorage is not available
    }
  }
};

/**
 * Format display name from email
 */
export function getDisplayName(email: string, fullName?: string): string {
  if (fullName && fullName.trim()) {
    return fullName.trim();
  }
  
  // Extract name from email
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Check if animation should be reduced based on user preference
 */
export function shouldReduceMotion(): boolean {
  if (!isClient) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}