'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  XCircle,
  Warning,
  ArrowsLeftRight,
  CurrencyGbp,
  Prohibit,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import type { TransactionStatus } from '@/types';

interface TransactionHeaderTransaction {
  id: string;
  senderName: string;
  recipientName: string;
  amountGBP: number;
  amountNGN: number;
  exchangeRate: number;
  fee: number;
  status: TransactionStatus;
  createdAt: string;
  completedAt?: string;
}

interface TransactionHeaderProps {
  transaction: TransactionHeaderTransaction;
}

const statusConfig: Record<TransactionStatus, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Pending' },
  processing: { icon: ArrowsLeftRight, color: 'text-primary-600', bgColor: 'bg-primary-100', label: 'Processing' },
  completed: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Completed' },
  failed: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Failed' },
  refunded: { icon: Warning, color: 'text-neutral-600', bgColor: 'bg-neutral-100', label: 'Refunded' },
  cancelled: { icon: Prohibit, color: 'text-neutral-500', bgColor: 'bg-neutral-50', label: 'Cancelled' },
};

export function TransactionHeader({ transaction }: TransactionHeaderProps) {
  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Transaction Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <CurrencyGbp size={28} className="text-primary-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {transaction.id}
                </h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                  <StatusIcon size={16} weight="fill" />
                  {status.label}
                </span>
              </div>
              <p className="text-neutral-500">
                {transaction.senderName} → {transaction.recipientName}
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Created {formatRelativeTime(transaction.createdAt)}
                {transaction.completedAt && transaction.status === 'completed' && (
                  <> • Completed {formatRelativeTime(transaction.completedAt)}</>
                )}
              </p>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="flex flex-col sm:flex-row gap-6 lg:text-right">
            <div>
              <p className="text-sm text-neutral-500">Amount Sent</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatCurrency(transaction.amountGBP, 'GBP')}
              </p>
              <p className="text-xs text-neutral-400">
                + {formatCurrency(transaction.fee, 'GBP')} fee
              </p>
            </div>

            <div className="hidden sm:flex items-center text-neutral-300">
              <ArrowsLeftRight size={24} />
            </div>

            <div>
              <p className="text-sm text-neutral-500">Amount Received</p>
              <p className="text-2xl font-bold text-green-600">
                ₦{transaction.amountNGN.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-400">
                @ ₦{transaction.exchangeRate.toLocaleString()}/£1
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
