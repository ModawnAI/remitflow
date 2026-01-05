'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  CurrencyGbp,
  Bank,
  ShieldCheck,
  PaperPlaneTilt,
} from '@phosphor-icons/react';
import type { TransactionEvent } from '@/types';
import { formatDate, cn } from '@/lib/utils';

export interface TransactionTimelineProps {
  events: TransactionEvent[];
  className?: string;
}

const eventIcons: Record<string, typeof Clock> = {
  initiated: CurrencyGbp,
  payment_received: Bank,
  compliance_check: ShieldCheck,
  settlement_started: PaperPlaneTilt,
  payout_initiated: Bank,
  completed: CheckCircle,
  failed: XCircle,
};

const statusColors = {
  success: {
    bg: 'bg-success/10',
    icon: 'text-success',
    line: 'bg-success',
  },
  failed: {
    bg: 'bg-error/10',
    icon: 'text-error',
    line: 'bg-error',
  },
  pending: {
    bg: 'bg-muted',
    icon: 'text-muted-foreground',
    line: 'bg-border',
  },
};

export function TransactionTimeline({
  events,
  className,
}: TransactionTimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, index) => {
        const Icon = eventIcons[event.type] || Clock;
        const colors = statusColors[event.status];
        const isLast = index === events.length - 1;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {/* Timeline line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[15px] top-[32px] h-full w-0.5',
                  colors.line
                )}
              />
            )}

            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                colors.bg
              )}
            >
              <Icon size={16} weight="bold" className={colors.icon} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {event.description}
                  </p>
                  {event.metadata && (
                    <div className="mt-1 space-y-0.5">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <p key={key} className="text-xs text-muted-foreground">
                          <span className="capitalize">{key.replace(/_/g, ' ')}</span>:{' '}
                          <span className="font-mono">{String(value)}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <time className="text-xs text-muted-foreground">
                  {formatDate(event.timestamp)}
                </time>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Example events for preview
export const exampleEvents: TransactionEvent[] = [
  {
    id: '1',
    transactionId: 'tx_001',
    type: 'initiated',
    status: 'success',
    description: 'Transaction initiated',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    metadata: { amount: '£500.00', recipient: 'John Okafor' },
  },
  {
    id: '2',
    transactionId: 'tx_001',
    type: 'payment_received',
    status: 'success',
    description: 'Payment received via Open Banking',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    metadata: { provider: 'TrueLayer', reference: 'PAY123456' },
  },
  {
    id: '3',
    transactionId: 'tx_001',
    type: 'compliance_check',
    status: 'success',
    description: 'Compliance checks passed',
    timestamp: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: '4',
    transactionId: 'tx_001',
    type: 'settlement_started',
    status: 'success',
    description: 'USDC settlement initiated',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    metadata: { network: 'Stellar', amount: '$635.00 USDC' },
  },
  {
    id: '5',
    transactionId: 'tx_001',
    type: 'payout_initiated',
    status: 'pending',
    description: 'Payout to Nigerian bank initiated',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    metadata: { bank: 'GTBank', account: '****4567' },
  },
];
