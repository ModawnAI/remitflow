'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

const trendConfig = {
  up: {
    icon: TrendUp,
    className: 'text-success',
    bgClassName: 'bg-success/10',
  },
  down: {
    icon: TrendDown,
    className: 'text-error',
    bgClassName: 'bg-error/10',
  },
  neutral: {
    icon: Minus,
    className: 'text-muted-foreground',
    bgClassName: 'bg-muted',
  },
};

export function MetricCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  className,
}: MetricCardProps) {
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border border-border bg-card p-6',
        'shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            className="mt-2 text-2xl font-semibold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {typeof value === 'number' ? (
              <CountUp value={value} />
            ) : (
              value
            )}
          </motion.p>
          {change !== undefined && (
            <div className={cn('mt-2 flex items-center gap-1', trendInfo.className)}>
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-full p-1',
                  trendInfo.bgClassName
                )}
              >
                <TrendIcon size={12} weight="bold" />
              </span>
              <span className="text-sm font-medium">
                {change >= 0 ? '+' : ''}
                {change.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/5 text-accent">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Simple count-up animation for numbers
function CountUp({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value.toLocaleString('en-GB')}
    </motion.span>
  );
}
