'use client';

import { useEffect } from 'react';
import type { Metadata } from 'next';
import { AuthCardWrapper } from '@/components/auth/auth-card-wrapper';
import { RegisterForm } from '@/components/auth/register-form';
import { PageTransition } from '@/components/animations/fade-in';
import { useAuthCheck } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/validation';

export default function RegisterPage() {
  const { requireGuest } = useAuthCheck();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    requireGuest();
  }, [requireGuest]);

  return (
    <PageTransition>
      <AuthCardWrapper
        title="Criar nova conta"
        subtitle="Cadastre-se para começar a organizar suas tarefas"
        footerLink={{
          href: ROUTES.LOGIN,
          text: 'Já tem uma conta?',
          linkText: 'Fazer login',
        }}
      >
        <RegisterForm />
      </AuthCardWrapper>
    </PageTransition>
  );
}