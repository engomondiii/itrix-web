import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'dark' | 'gold' | 'destructive' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-fast ease-out select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-ink-primary text-white shadow-1 hover:bg-structure-600 active:bg-ink-primary',
  secondary: 'bg-transparent text-ink-secondary border border-border-strong hover:bg-surface hover:border-ink-secondary',
  dark: 'bg-structure-600 text-ink-inverse hover:bg-structure-700 focus-visible:ring-accent-soft',
  gold: 'bg-accent text-structure-900 font-semibold shadow-signature hover:bg-accent-soft',
  destructive: 'bg-error text-white hover:brightness-95 active:brightness-90',
  ghost: 'bg-transparent text-ink-primary hover:bg-soft',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-secondary',
  md: 'h-10 px-4 text-body',
  lg: 'h-12 px-6 text-web-body',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', leadingIcon, trailingIcon, fullWidth, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
});
