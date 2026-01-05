'use client';

import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowClockwise,
  Warning,
  type Icon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface StatusBadgeProps {
  status: TransactionStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  TransactionStatus,
  {
    label: string;
    icon: Icon;
    className: string;
  }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-secondary/10 text-secondary',
  },
  processing: {
    label: 'Processing',
    icon: ArrowClockwise,
    className: 'bg-info/10 text-info',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    className: 'bg-success/10 text-success',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-error/10 text-error',
  },
  refunded: {
    label: 'Refunded',
    icon: ArrowClockwise,
    className: 'bg-warning/10 text-warning',
  },
  cancelled: {
    label: 'Cancelled',
    icon: Warning,
    className: 'bg-muted text-muted-foreground',
  },
};

const sizeStyles = {
  sm: {
    badge: 'px-2 py-0.5 text-xs gap-1',
    icon: 12,
  },
  md: {
    badge: 'px-2.5 py-1 text-xs gap-1.5',
    icon: 14,
  },
  lg: {
    badge: 'px-3 py-1.5 text-sm gap-2',
    icon: 16,
  },
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeConfig = sizeStyles[size];
  const IconComponent = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.className,
        sizeConfig.badge,
        className
      )}
    >
      {showIcon && (
        <IconComponent
          size={sizeConfig.icon}
          weight={status === 'processing' ? 'regular' : 'fill'}
          className={status === 'processing' ? 'animate-spin' : ''}
        />
      )}
      {config.label}
    </span>
  );
}
