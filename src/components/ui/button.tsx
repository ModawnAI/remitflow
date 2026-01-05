'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { CircleNotch } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  asChild?: boolean;
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground hover:brightness-110 focus-visible:ring-ring shadow-sm hover:shadow-accent',
  secondary:
    'bg-muted text-foreground hover:bg-muted/80 focus-visible:ring-ring',
  outline:
    'border border-border bg-card text-foreground hover:bg-muted focus-visible:ring-ring',
  ghost:
    'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring',
  destructive:
    'bg-error text-error-foreground hover:bg-error/90 focus-visible:ring-error shadow-sm',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

const iconSizeStyles = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <CircleNotch
              size={iconSizeStyles[size]}
              className="animate-spin"
            />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
