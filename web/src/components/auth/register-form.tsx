'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shake } from '@/components/animations/fade-in';
import { useAuthMutations } from '@/hooks/use-auth';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

/**
 * RegisterForm component handles new user registration
 */
export const RegisterForm: React.FC<{ className?: string }> = ({ className }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const { register: registerUser } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser.mutateAsync(userData);
    } catch (error: any) {
      // Trigger shake animation on error
      setShakeError(true);
      setTimeout(() => setShakeError(false), 400);
      
      // Set form errors if validation errors are returned
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field as keyof RegisterFormData, {
              type: 'server',
              message: messages[0],
            });
          }
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Shake trigger={shakeError} className={cn('space-y-4', className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Digite seu nome completo"
            error={!!errors.name}
            {...register('name')}
            className={cn(
              'h-11 text-base', // Prevent zoom on mobile
              errors.name && 'border-destructive focus-visible:ring-destructive'
            )}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-sm text-destructive animate-slide-down"
              role="alert"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu email"
            error={!!errors.email}
            {...register('email')}
            className={cn(
              'h-11 text-base', // Prevent zoom on mobile
              errors.email && 'border-destructive focus-visible:ring-destructive'
            )}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive animate-slide-down"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              error={!!errors.password}
              {...register('password')}
              className={cn(
                'h-11 text-base pr-10', // Prevent zoom on mobile, space for icon
                errors.password && 'border-destructive focus-visible:ring-destructive'
              )}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-destructive animate-slide-down"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirme sua senha"
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
              className={cn(
                'h-11 text-base pr-10', // Prevent zoom on mobile, space for icon
                errors.confirmPassword && 'border-destructive focus-visible:ring-destructive'
              )}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            />
            <Button
              type="button"
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="text-sm text-destructive animate-slide-down"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          loading={isSubmitting || registerUser.isPending}
          disabled={isSubmitting || registerUser.isPending}
        >
          {isSubmitting || registerUser.isPending ? 'Criando conta...' : 'Criar conta'}
        </Button>

        {/* Terms and Privacy Notice */}
        <p className="text-xs text-muted-foreground text-center">
          Ao criar uma conta, você concorda com nossos{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-xs text-primary hover:underline"
            onClick={() => {
              // TODO: Implement terms of service
              console.log('Terms of service clicked');
            }}
          >
            Termos de Serviço
          </Button>{' '}
          e{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-xs text-primary hover:underline"
            onClick={() => {
              // TODO: Implement privacy policy
              console.log('Privacy policy clicked');
            }}
          >
            Política de Privacidade
          </Button>
        </p>
      </form>
    </Shake>
  );
};