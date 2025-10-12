'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageTransition } from '@/components/animations/fade-in';
import { useAuthCheck } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/validation';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthCheck();

  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    } else {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    </PageTransition>
  );
}