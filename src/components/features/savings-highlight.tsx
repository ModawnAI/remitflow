'use client';

import { motion } from 'framer-motion';
import {
  TrendUp,
  Coins,
  Lightning,
  Leaf,
  ArrowRight,
  Trophy,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import type { TransactionWithCrypto } from '@/types';

export interface SavingsHighlightProps {
  transactions: TransactionWithCrypto[];
  className?: string;
}

export function SavingsHighlight({
  transactions,
  className,
}: SavingsHighlightProps) {
  // Calculate savings metrics
  const cryptoTransactions = transactions.filter(
    (tx) => tx.rail === 'crypto_fast' || tx.rail === 'crypto_cheap'
  );

  const totalSavingsNGN = cryptoTransactions.reduce(
    (sum, tx) => sum + (tx.crypto?.savingsVsTraditional || 0),
    0
  );

  const expressTransactions = cryptoTransactions.filter(
    (tx) => tx.rail === 'crypto_fast'
  );
  const saverTransactions = cryptoTransactions.filter(
    (tx) => tx.rail === 'crypto_cheap'
  );

  const expressSavings = expressTransactions.reduce(
    (sum, tx) => sum + (tx.crypto?.savingsVsTraditional || 0),
    0
  );
  const saverSavings = saverTransactions.reduce(
    (sum, tx) => sum + (tx.crypto?.savingsVsTraditional || 0),
    0
  );

  // Average savings percentage
  const avgSavingsPercentage =
    cryptoTransactions.length > 0
      ? cryptoTransactions.reduce(
          (sum, tx) => sum + (tx.crypto?.savingsPercentage || 0),
          0
        ) / cryptoTransactions.length
      : 0;

  // Convert NGN to GBP for display (approximate)
  const totalSavingsGBP = totalSavingsNGN / 1578.25;

  return (
    <Card
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={18} weight="fill" className="text-amber-500" />
              <span className="text-[10px] uppercase tracking-wide font-semibold text-emerald-600">
                Customer Savings
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Total saved vs traditional bank transfers
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
            <TrendUp size={12} className="text-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-600">
              +{avgSavingsPercentage.toFixed(1)}% avg
            </span>
          </div>
        </div>

        {/* Main savings display */}
        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex flex-col items-center"
          >
            <span className="text-xs text-muted-foreground mb-1">
              This Month
            </span>
            <span className="text-4xl font-bold text-emerald-600">
              {formatCurrency(totalSavingsNGN, 'NGN', {
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              ({formatCurrency(totalSavingsGBP, 'GBP')})
            </span>
          </motion.div>
        </div>

        {/* Breakdown by rail */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg bg-white/50 dark:bg-white/5 p-3 border border-amber-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500">
                <Lightning size={14} weight="bold" className="text-white" />
              </div>
              <span className="text-xs font-medium text-foreground">
                Crypto Express
              </span>
            </div>
            <p className="text-lg font-bold text-amber-600">
              {formatCurrency(expressSavings, 'NGN', {
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {expressTransactions.length} transactions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg bg-white/50 dark:bg-white/5 p-3 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500">
                <Leaf size={14} weight="bold" className="text-white" />
              </div>
              <span className="text-xs font-medium text-foreground">
                Crypto Saver
              </span>
            </div>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(saverSavings, 'NGN', {
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {saverTransactions.length} transactions
            </p>
          </motion.div>
        </div>

        {/* How it works */}
        <div className="mt-4 pt-3 border-t border-emerald-500/10">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
            Stablecoin Sandwich Model
          </p>
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-medium text-foreground">GBP</span>
            <ArrowRight size={10} className="text-muted-foreground" />
            <span className="text-blue-500">USD</span>
            <ArrowRight size={10} className="text-muted-foreground" />
            <span className="text-emerald-500 font-semibold">USDT</span>
            <ArrowRight size={10} className="text-muted-foreground" />
            <span className="font-medium text-foreground">NGN</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            Revolut 1:1 USD↔USDT conversion = Zero stablecoin fees
          </p>
        </div>
      </div>
    </Card>
  );
}
