'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SlideUp, StaggerChildren } from '@/components/animations/fade-in';
import { cn } from '@/lib/utils';
import type { AuthCardWrapperProps } from '@/types';

/**
 * AuthCardWrapper component provides consistent container layout 
 * for authentication forms with animations
 */
export const AuthCardWrapper: React.FC<AuthCardWrapperProps> = ({
  title,
  subtitle,
  footerLink,
  children,
  className,
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <SlideUp className="w-full max-w-md">
        <Card className={cn('w-full shadow-lg', className)}>
          <CardHeader className="space-y-1 text-center">
            <StaggerChildren staggerDelay={100}>
              {/* Logo/Brand Icon */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckCircle className="h-6 w-6" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h2>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </StaggerChildren>
          </CardHeader>

          <CardContent className="space-y-4">
            <StaggerChildren staggerDelay={50}>
              {children}
            </StaggerChildren>
          </CardContent>

          {/* Footer with navigation link */}
          {footerLink && (
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                {footerLink.text}{' '}
                <Link
                  href={footerLink.href}
                  className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  {footerLink.linkText}
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </SlideUp>
    </div>
  );
};