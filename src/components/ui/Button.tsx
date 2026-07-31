import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The button primitive.
 *
 * ── WHY THIS DOES NOT USE TAILWIND UTILITIES FOR ITS APPEARANCE ─────────────
 * It used to: `bg-ink-primary text-white shadow-1 h-12 px-6 text-web-body`. Of those,
 * only `text-white` and the spacing utilities compiled. This project runs Tailwind v4,
 * which does not read `tailwind.config.ts` unless a stylesheet opts in with `@config` —
 * and none does. So every custom colour, shadow and type-scale name in that config
 * produces no CSS at all.
 *
 * The visible result was a TRANSPARENT button with WHITE text on a near-white glass
 * panel. It rendered, it was 48px tall, it took focus and it fired its onClick. It just
 * could not be seen. That is the whole of the "create account button is not visible"
 * report, and it affected every Button on every screen — the sign-up form is simply
 * where somebody finally needed one.
 *
 * The appearance now comes from token-driven classes in `src/styles/base.css`, the same
 * way the rest of this surface is styled (auth.css, arrival.css, shell.css). Two
 * consequences worth stating:
 *
 *   1. it cannot silently lose its styling again — a missing `.btn--primary` rule is a
 *      visible regression in one stylesheet, not an invisible no-op in a config file;
 *   2. enabling `@config` later cannot conflict with it, because these are plain classes
 *      rather than utilities, appended OUTSIDE `@layer base` so they win regardless.
 *
 * The public API is unchanged: same variants, same sizes, same `fullWidth`, same icon
 * slots, same `className` passthrough. No call site needs editing.
 */

type Variant = 'primary' | 'secondary' | 'dark' | 'gold' | 'destructive' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  dark: 'btn--dark',
  gold: 'btn--gold',
  destructive: 'btn--destructive',
  ghost: 'btn--ghost',
};

const sizeClass: Record<Size, string> = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    fullWidth,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'btn',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'btn--block',
        className,
      )}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
});
