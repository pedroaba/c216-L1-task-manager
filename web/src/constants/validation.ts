// Validation constants aligned with backend requirements
export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    MAX_LENGTH: 255,
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 255,
  },
} as const;

// Error messages in Portuguese (matching backend)
export const ERROR_MESSAGES = {
  REQUIRED: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha inválida',
  NAME_TOO_SHORT: 'Nome precisa ter 5 caracteres',
  PASSWORD_TOO_SHORT: 'Senha precisa ter 8 caracteres',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  USER_ALREADY_EXISTS: 'Usuário já existe',
  SERVER_ERROR: 'Erro no servidor',
  CONNECTION_ERROR: 'Erro de conexão',
  SESSION_EXPIRED: 'Sessão expirada',
  UNAUTHORIZED: 'Não autorizado',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_OUT: '/auth/sign-out',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  USERS: {
    REGISTER: '/users/register',
    PROFILE: '/users/profile',
  },
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  MEDIUM: 300,
  SLOW: 500,
  ENTRANCE: 500,
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Toast notification configuration
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 3000,
  ERROR_DURATION: 5000,
  SUCCESS_DURATION: 2000,
  MAX_TOASTS: 5,
} as const;