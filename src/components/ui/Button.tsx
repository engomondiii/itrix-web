import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'dark' | 'gold' | 'destructive' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-fast ease-out select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-sapphire-600 text-white shadow-1 hover:bg-sapphire-500 active:bg-sapphire-700',
  secondary: 'bg-transparent text-ink-700 border border-line-strong hover:bg-surface-warm hover:border-ink-400',
  dark: 'bg-indigo-700 text-oni hover:bg-indigo-800 focus-visible:ring-gold-400',
  gold: 'bg-gold-500 text-indigo-950 font-semibold shadow-gold hover:bg-gold-400',
  destructive: 'bg-error text-white hover:brightness-95 active:brightness-90',
  ghost: 'bg-transparent text-sapphire-600 hover:bg-sapphire-50',
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
