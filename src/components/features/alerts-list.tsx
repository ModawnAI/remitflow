'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  Warning,
  XCircle,
  SealWarning,
  X,
  ArrowRight,
} from '@phosphor-icons/react';
import type { Alert, AlertSeverity } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';

export interface AlertsListProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
  onView?: (alertId: string) => void;
  className?: string;
}

const severityConfig: Record<
  AlertSeverity,
  {
    icon: typeof Info;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  info: {
    icon: Info,
    bgColor: 'bg-info/5',
    borderColor: 'border-info/20',
    iconColor: 'text-info',
    titleColor: 'text-info',
  },
  warning: {
    icon: Warning,
    bgColor: 'bg-warning/5',
    borderColor: 'border-warning/20',
    iconColor: 'text-warning',
    titleColor: 'text-warning',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-error/5',
    borderColor: 'border-error/20',
    iconColor: 'text-error',
    titleColor: 'text-error',
  },
  critical: {
    icon: SealWarning,
    bgColor: 'bg-error/10',
    borderColor: 'border-error/30',
    iconColor: 'text-error',
    titleColor: 'text-error',
  },
};

export function AlertsList({
  alerts,
  onDismiss,
  onView,
  className,
}: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className={cn('py-8 text-center', className)}>
        <Info size={32} className="mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No alerts at this time</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onDismiss={onDismiss}
            onView={onView}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface AlertItemProps {
  alert: Alert;
  onDismiss?: (alertId: string) => void;
  onView?: (alertId: string) => void;
}

function AlertItem({ alert, onDismiss, onView }: AlertItemProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'relative rounded-lg border p-4',
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn('shrink-0', config.iconColor)}>
          <Icon size={20} weight="fill" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn('text-sm font-medium', config.titleColor)}>
              {alert.title}
            </h4>
            <time className="shrink-0 text-xs text-muted-foreground">
              {formatRelativeTime(alert.createdAt)}
            </time>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>

          {/* Actions */}
          {(alert.link || onView) && (
            <button
              onClick={() => onView?.(alert.id)}
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-xs font-medium',
                config.iconColor,
                'hover:underline'
              )}
            >
              View details
              <ArrowRight size={12} />
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {onDismiss && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Example alerts for preview
export const exampleAlerts: Alert[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'Payment Gateway Issue',
    message: 'TrueLayer API is experiencing elevated error rates. Some payments may be delayed.',
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: '2',
    severity: 'warning',
    title: 'High KYC Queue',
    message: '15 applications pending review for over 24 hours.',
    link: '/kyc',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    severity: 'info',
    title: 'Exchange Rate Updated',
    message: 'GBP/NGN rate updated to 1,950.50',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];
