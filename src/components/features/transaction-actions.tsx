'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowCounterClockwise,
  CurrencyGbp,
  Warning,
  ChatCircleText,
  CopySimple,
  Check,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TransactionStatus } from '@/types';

interface ActionTransaction {
  id: string;
  status: TransactionStatus;
  amountGBP: number;
  senderName: string;
  recipientName: string;
}

interface TransactionActionsProps {
  transaction: ActionTransaction;
  onRetry?: () => Promise<void>;
  onRefund?: () => Promise<void>;
  onEscalate?: () => Promise<void>;
}

export function TransactionActions({
  transaction,
  onRetry,
  onRefund,
  onEscalate,
}: TransactionActionsProps) {
  const [retrying, setRetrying] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [copied, setCopied] = useState(false);

  const canRetry = transaction.status === 'failed';
  const canRefund = ['completed', 'failed'].includes(transaction.status);
  const canEscalate = transaction.status !== 'refunded';

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry?.();
    } finally {
      setRetrying(false);
    }
  };

  const handleRefund = async () => {
    setRefunding(true);
    try {
      await onRefund?.();
    } finally {
      setRefunding(false);
    }
  };

  const handleEscalate = async () => {
    setEscalating(true);
    try {
      await onEscalate?.();
    } finally {
      setEscalating(false);
    }
  };

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(transaction.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Actions</h3>

        <div className="space-y-3">
          {/* Copy Transaction ID */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCopyId}
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <CopySimple size={18} />
                Copy Transaction ID
              </>
            )}
          </Button>

          {/* Retry Button */}
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start',
              !canRetry && 'opacity-50 cursor-not-allowed'
            )}
            disabled={!canRetry || retrying}
            onClick={handleRetry}
          >
            <ArrowCounterClockwise size={18} className={retrying ? 'animate-spin' : ''} />
            {retrying ? 'Retrying...' : 'Retry Transaction'}
          </Button>

          {/* Refund Button */}
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start',
              !canRefund && 'opacity-50 cursor-not-allowed'
            )}
            disabled={!canRefund || refunding}
            onClick={handleRefund}
          >
            <CurrencyGbp size={18} />
            {refunding ? 'Processing Refund...' : 'Issue Refund'}
          </Button>

          {/* Escalate Button */}
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50',
              !canEscalate && 'opacity-50 cursor-not-allowed'
            )}
            disabled={!canEscalate || escalating}
            onClick={handleEscalate}
          >
            <Warning size={18} />
            {escalating ? 'Escalating...' : 'Escalate to Support'}
          </Button>
        </div>

        {/* Quick Info */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Quick Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Status</span>
              <span className={cn(
                'font-medium capitalize',
                transaction.status === 'completed' && 'text-green-600',
                transaction.status === 'failed' && 'text-red-600',
                transaction.status === 'processing' && 'text-primary-600',
                transaction.status === 'pending' && 'text-amber-600',
              )}>
                {transaction.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Amount</span>
              <span className="font-medium">£{transaction.amountGBP.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <Button variant="ghost" className="w-full justify-start text-neutral-600">
            <ChatCircleText size={18} />
            Contact Support
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
