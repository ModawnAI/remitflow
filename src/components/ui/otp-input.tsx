'use client';

import { useRef, useState, useCallback, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function OTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  error,
  className,
}: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split('').concat(Array(length - value.length).fill(''));

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  }, [length]);

  const handleChange = (index: number, inputValue: string) => {
    // Only accept digits
    const digit = inputValue.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    const newValue = newDigits.join('').slice(0, length);

    onChange?.(newValue);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }

    if (newValue.length === length) {
      onComplete?.(newValue);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];

      if (digits[index]) {
        // Clear current digit
        newDigits[index] = '';
        onChange?.(newDigits.join(''));
      } else if (index > 0) {
        // Move to previous and clear
        newDigits[index - 1] = '';
        onChange?.(newDigits.join(''));
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

    if (pastedData) {
      onChange?.(pastedData);
      focusInput(Math.min(pastedData.length, length - 1));

      if (pastedData.length === length) {
        onComplete?.(pastedData);
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-center gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={cn(
              'h-12 w-10 rounded-lg border bg-card text-center text-lg font-semibold text-foreground',
              'transition-colors duration-150',
              'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
              'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground',
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : focusedIndex === index
                ? 'border-accent'
                : 'border-border'
            )}
          />
        ))}
      </div>
      {error && (
        <p className="text-center text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
