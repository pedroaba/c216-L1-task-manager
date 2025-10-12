'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from '@/components/ui/toast';

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map(({ id, title, description, type, ...props }) => (
        <Toast
          key={id}
          variant={
            type === 'error'
              ? 'destructive'
              : type === 'success'
              ? 'success'
              : type === 'warning'
              ? 'warning'
              : 'default'
          }
          {...props}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
    </>
  );
}