'use client';

import type { ReactNode } from 'react';
import { forwardRef, useId } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CaretDown, CaretUp, Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      options,
      placeholder = 'Select an option',
      label,
      error,
      disabled,
      className,
    },
    ref
  ) => {
    const generatedId = useId();
    const errorId = `${generatedId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm',
              'placeholder:text-muted-foreground',
              'transition-colors duration-150',
              'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
              'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground',
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-border',
              className
            )}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon asChild>
              <CaretDown size={16} className="text-muted-foreground" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="z-50 max-h-[300px] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-card shadow-lg"
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white">
                <CaretUp size={14} />
              </SelectPrimitive.ScrollUpButton>

              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white">
                <CaretDown size={14} />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface SelectItemProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

function SelectItem({ value, disabled, children }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md px-8 py-2 text-sm text-foreground outline-none',
        'focus:bg-muted',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
      )}
    >
      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
        <Check size={14} weight="bold" className="text-accent" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
