import { z } from 'zod';
import { VALIDATION, ERROR_MESSAGES } from '@/constants/validation';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(VALIDATION.EMAIL.MAX_LENGTH, 'Email muito longo'),
    
  password: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED),
});

/**
 * Registration form validation schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .min(VALIDATION.NAME.MIN_LENGTH, ERROR_MESSAGES.NAME_TOO_SHORT)
    .max(VALIDATION.NAME.MAX_LENGTH, 'Nome muito longo')
    .trim(),
    
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(VALIDATION.EMAIL.MAX_LENGTH, 'Email muito longo'),
    
  password: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .min(VALIDATION.PASSWORD.MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
    .max(VALIDATION.PASSWORD.MAX_LENGTH, 'Senha muito longa'),
    
  confirmPassword: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED),
}).refine((data) => data.password === data.confirmPassword, {
  message: ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
  path: ['confirmPassword'],
});

/**
 * Profile update validation schema
 */
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME.MIN_LENGTH, ERROR_MESSAGES.NAME_TOO_SHORT)
    .max(VALIDATION.NAME.MAX_LENGTH, 'Nome muito longo')
    .trim()
    .optional(),
    
  email: z
    .string()
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(VALIDATION.EMAIL.MAX_LENGTH, 'Email muito longo')
    .optional(),
});

/**
 * Password change validation schema
 */
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED),
    
  newPassword: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .min(VALIDATION.PASSWORD.MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
    .max(VALIDATION.PASSWORD.MAX_LENGTH, 'Senha muito longa'),
    
  confirmNewPassword: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
  path: ['confirmNewPassword'],
});

// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

// Validation helper functions
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }
  
  // Transform Zod errors to flat error object
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });
  
  return {
    success: false,
    errors,
  };
};