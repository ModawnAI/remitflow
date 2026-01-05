'use client';

import { Clock, CheckCircle, XCircle, ChartBar } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface KYCStats {
  pending: number;
  approvedToday: number;
  rejectedToday: number;
  averageReviewTime: string;
}

export interface KYCStatsBarProps {
  stats: KYCStats;
  className?: string;
}

export function KYCStatsBar({ stats, className }: KYCStatsBarProps) {
  const items = [
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Approved Today',
      value: stats.approvedToday,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Rejected Today',
      value: stats.rejectedToday,
      icon: XCircle,
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    {
      label: 'Avg. Review Time',
      value: stats.averageReviewTime,
      icon: ChartBar,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ];

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', item.bgColor)}>
              <item.icon size={20} className={item.color} weight="bold" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
