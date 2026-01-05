'use client';

import {
  CurrencyGbp,
  ArrowsLeftRight,
  CheckCircle,
  Clock,
} from '@phosphor-icons/react';
import { MetricCard } from '@/components/ui';
import type { Metric } from '@/types';
import { formatCurrency } from '@/lib/utils';

export interface MetricsGridProps {
  metrics: Metric[];
  className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  volume: <CurrencyGbp size={24} weight="bold" />,
  transactions: <ArrowsLeftRight size={24} />,
  success: <CheckCircle size={24} />,
  pending: <Clock size={24} />,
};

export function MetricsGrid({ metrics, className }: MetricsGridProps) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          let displayValue: string;

          if (metric.format === 'currency' && metric.currency) {
            displayValue = formatCurrency(
              typeof metric.value === 'number' ? metric.value : parseFloat(metric.value as string),
              metric.currency
            );
          } else if (metric.format === 'percentage') {
            displayValue = `${metric.value}%`;
          } else if (typeof metric.value === 'number') {
            displayValue = metric.value.toLocaleString('en-GB');
          } else {
            displayValue = metric.value;
          }

          return (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={displayValue}
              change={metric.change}
              trend={metric.trend}
              icon={iconMap[metric.id] || iconMap.transactions}
            />
          );
        })}
      </div>
    </div>
  );
}

// Example metrics for dashboard
export const defaultDashboardMetrics: Metric[] = [
  {
    id: 'volume',
    title: 'Volume (24h)',
    value: 125750,
    format: 'currency',
    currency: 'GBP',
    change: 12.5,
    trend: 'up',
  },
  {
    id: 'transactions',
    title: 'Transactions (24h)',
    value: 342,
    format: 'number',
    change: 8.2,
    trend: 'up',
  },
  {
    id: 'success',
    title: 'Success Rate',
    value: 98.5,
    format: 'percentage',
    change: 0.3,
    trend: 'up',
  },
  {
    id: 'pending',
    title: 'Pending KYC',
    value: 12,
    format: 'number',
    change: -15,
    trend: 'down',
  },
];
