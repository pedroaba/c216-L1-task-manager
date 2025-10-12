// Component prop types
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// Animation component props
export interface AnimationProps extends BaseProps {
  delay?: number;
  duration?: number;
  disabled?: boolean;
}

// Card wrapper props
export interface AuthCardWrapperProps extends BaseProps {
  title: string;
  subtitle?: string;
  footerLink?: {
    href: string;
    text: string;
    linkText: string;
  };
}

// Form component props
export interface FormFieldProps extends BaseProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// Button variants
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Route types
export type RouteParams = Record<string, string | string[] | undefined>;
export type SearchParams = Record<string, string | string[] | undefined>;