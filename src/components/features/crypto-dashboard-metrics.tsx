'use client';

import { motion } from 'framer-motion';
import {
  CurrencyDollar,
  Lightning,
  Leaf,
  TrendUp,
  Clock,
  Percent,
  ArrowsClockwise,
  Bank,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import type { TransactionWithCrypto } from '@/types';

export interface CryptoDashboardMetricsProps {
  transactions: TransactionWithCrypto[];
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconBgClass: string;
  featured?: boolean;
}

function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon: Icon,
  iconBgClass,
  featured,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-xl border p-4',
        featured
          ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10'
          : 'border-border bg-card'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <TrendUp
                size={14}
                className={change >= 0 ? 'text-success' : 'text-destructive'}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  change >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {change >= 0 ? '+' : ''}
                {change.toFixed(1)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-muted-foreground">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            iconBgClass
          )}
        >
          <Icon size={20} weight="bold" className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export function CryptoDashboardMetrics({
  transactions,
  className,
}: CryptoDashboardMetricsProps) {
  // Calculate metrics from transactions
  const cryptoTransactions = transactions.filter(
    (tx) => tx.rail === 'crypto_fast' || tx.rail === 'crypto_cheap'
  );
  const traditionalTransactions = transactions.filter(
    (tx) => tx.rail === 'traditional'
  );

  // Total USDT Volume (approximate from crypto transactions)
  const totalCryptoVolume = cryptoTransactions.reduce(
    (sum, tx) => sum + tx.sendAmount,
    0
  );
  const totalUSDTVolume = totalCryptoVolume * 1.2685; // GBP to USD rate

  // Total Savings vs Traditional
  const totalSavings = cryptoTransactions.reduce(
    (sum, tx) => sum + (tx.crypto?.savingsVsTraditional || 0),
    0
  );

  // Crypto rail usage percentage
  const cryptoPercentage =
    transactions.length > 0
      ? (cryptoTransactions.length / transactions.length) * 100
      : 0;

  // Average delivery time for crypto
  const completedCrypto = cryptoTransactions.filter(
    (tx) => tx.status === 'completed'
  );
  const avgDeliveryMinutes =
    completedCrypto.length > 0
      ? completedCrypto.reduce((sum, tx) => {
          const created = new Date(tx.createdAt);
          const completed = new Date(tx.completedAt || tx.updatedAt);
          return sum + (completed.getTime() - created.getTime()) / 60000;
        }, 0) / completedCrypto.length
      : 18; // Default estimate

  // Express vs Saver breakdown
  const expressCount = cryptoTransactions.filter(
    (tx) => tx.rail === 'crypto_fast'
  ).length;
  const saverCount = cryptoTransactions.filter(
    (tx) => tx.rail === 'crypto_cheap'
  ).length;

  // Processing transactions
  const processingCount = transactions.filter(
    (tx) => tx.status === 'processing'
  ).length;

  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {/* Featured: USDT Volume */}
      <MetricCard
        title="USDT Volume (24h)"
        value={formatCurrency(totalUSDTVolume, 'USD', { maximumFractionDigits: 0 })}
        subtitle="via Revolut X Exchange"
        change={23.5}
        changeLabel="vs yesterday"
        icon={CurrencyDollar}
        iconBgClass="bg-amber-500"
        featured
      />

      {/* Total Savings */}
      <MetricCard
        title="Customer Savings"
        value={formatCurrency(totalSavings, 'NGN', { maximumFractionDigits: 0 })}
        subtitle="vs traditional rails"
        change={15.2}
        changeLabel="this week"
        icon={TrendUp}
        iconBgClass="bg-emerald-500"
      />

      {/* Crypto Rail Usage */}
      <MetricCard
        title="Crypto Rail Usage"
        value={`${cryptoPercentage.toFixed(0)}%`}
        subtitle={`${expressCount} Express / ${saverCount} Saver`}
        change={8.3}
        changeLabel="adoption"
        icon={ArrowsClockwise}
        iconBgClass="bg-violet-500"
      />

      {/* Average Delivery Time */}
      <MetricCard
        title="Avg. Delivery Time"
        value={`${Math.round(avgDeliveryMinutes)} min`}
        subtitle={`${processingCount} processing now`}
        icon={Clock}
        iconBgClass="bg-blue-500"
      />
    </div>
  );
}

export interface RailBreakdownCardProps {
  transactions: TransactionWithCrypto[];
  className?: string;
}

export function RailBreakdownCard({
  transactions,
  className,
}: RailBreakdownCardProps) {
  const expressVolume = transactions
    .filter((tx) => tx.rail === 'crypto_fast')
    .reduce((sum, tx) => sum + tx.sendAmount, 0);

  const saverVolume = transactions
    .filter((tx) => tx.rail === 'crypto_cheap')
    .reduce((sum, tx) => sum + tx.sendAmount, 0);

  const traditionalVolume = transactions
    .filter((tx) => tx.rail === 'traditional')
    .reduce((sum, tx) => sum + tx.sendAmount, 0);

  const totalVolume = expressVolume + saverVolume + traditionalVolume;

  const rails = [
    {
      name: 'Crypto Express',
      icon: Lightning,
      iconBg: 'bg-amber-500',
      volume: expressVolume,
      percentage: totalVolume > 0 ? (expressVolume / totalVolume) * 100 : 0,
      color: 'bg-amber-500',
    },
    {
      name: 'Crypto Saver',
      icon: Leaf,
      iconBg: 'bg-emerald-500',
      volume: saverVolume,
      percentage: totalVolume > 0 ? (saverVolume / totalVolume) * 100 : 0,
      color: 'bg-emerald-500',
    },
    {
      name: 'Bank Transfer',
      icon: Bank,
      iconBg: 'bg-slate-500',
      volume: traditionalVolume,
      percentage: totalVolume > 0 ? (traditionalVolume / totalVolume) * 100 : 0,
      color: 'bg-slate-400',
    },
  ];

  return (
    <Card className={cn('p-4', className)}>
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Rail Distribution
      </h3>

      {/* Bar visualization */}
      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-muted">
        {rails.map((rail, index) => (
          <motion.div
            key={rail.name}
            initial={{ width: 0 }}
            animate={{ width: `${rail.percentage}%` }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={cn('h-full', rail.color)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {rails.map((rail) => (
          <div key={rail.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded',
                  rail.iconBg
                )}
              >
                <rail.icon size={14} weight="bold" className="text-white" />
              </div>
              <span className="text-sm text-foreground">{rail.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(rail.volume, 'GBP')}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({rail.percentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
