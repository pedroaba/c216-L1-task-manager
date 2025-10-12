'use client';

import { useEffect } from 'react';
import type { Metadata } from 'next';
import { AuthCardWrapper } from '@/components/auth/auth-card-wrapper';
import { LoginForm } from '@/components/auth/login-form';
import { PageTransition } from '@/components/animations/fade-in';
import { useAuthCheck } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/validation';

export default function LoginPage() {
  const { requireGuest } = useAuthCheck();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    requireGuest();
  }, [requireGuest]);

  return (
    <PageTransition>
      <AuthCardWrapper
        title="Bem-vindo de volta"
        subtitle="Entre com sua conta para acessar o gerenciador de tarefas"
        footerLink={{
          href: ROUTES.REGISTER,
          text: 'Não tem uma conta?',
          linkText: 'Criar conta',
        }}
      >
        <LoginForm />
      </AuthCardWrapper>
    </PageTransition>
  );
}