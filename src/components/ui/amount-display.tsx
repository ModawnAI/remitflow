import { cn, formatCurrency } from '@/lib/utils';

export interface AmountDisplayProps {
  amount: number;
  currency: string;
  showSign?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg font-semibold',
};

export function AmountDisplay({
  amount,
  currency,
  showSign = false,
  size = 'md',
  className,
}: AmountDisplayProps) {
  const formatted = formatCurrency(Math.abs(amount), currency);
  const isNegative = amount < 0;
  const sign = showSign ? (isNegative ? '-' : '+') : '';
  const displayValue = showSign ? `${sign}${formatted}` : formatted;

  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        sizeStyles[size],
        showSign && isNegative && 'text-error',
        showSign && !isNegative && amount > 0 && 'text-success',
        className
      )}
    >
      {displayValue}
    </span>
  );
}
