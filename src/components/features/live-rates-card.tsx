'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowsLeftRight,
  TrendUp,
  TrendDown,
  Clock,
  Lightning,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';

export interface LiveRatesCardProps {
  className?: string;
}

interface Rate {
  pair: string;
  from: string;
  to: string;
  rate: number;
  change24h: number;
  provider: string;
  highlight?: boolean;
}

const liveRates: Rate[] = [
  {
    pair: 'GBP/USD',
    from: 'GBP',
    to: 'USD',
    rate: 1.2685,
    change24h: 0.15,
    provider: 'Revolut',
    highlight: true,
  },
  {
    pair: 'USD/USDT',
    from: 'USD',
    to: 'USDT',
    rate: 1.0,
    change24h: 0,
    provider: 'Revolut X',
    highlight: true,
  },
  {
    pair: 'USDT/NGN',
    from: 'USDT',
    to: 'NGN',
    rate: 1578.25,
    change24h: -0.32,
    provider: 'Yellow Card',
    highlight: true,
  },
  {
    pair: 'GBP/NGN',
    from: 'GBP',
    to: 'NGN',
    rate: 1685.5,
    change24h: -0.45,
    provider: 'Traditional',
  },
];

function RateRow({ rate, index }: { rate: Rate; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'flex items-center justify-between py-2',
        index < liveRates.length - 1 && 'border-b border-border'
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-foreground text-sm">
            {rate.from}
          </span>
          <ArrowsLeftRight size={12} className="text-muted-foreground" />
          <span className="font-semibold text-foreground text-sm">{rate.to}</span>
        </div>
        {rate.highlight && (
          <Lightning size={12} weight="fill" className="text-amber-500" />
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="font-mono font-semibold text-foreground text-sm">
            {rate.rate.toLocaleString('en-US', {
              minimumFractionDigits: rate.rate < 10 ? 4 : 2,
              maximumFractionDigits: rate.rate < 10 ? 4 : 2,
            })}
          </span>
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5 text-[10px] font-medium min-w-[50px] justify-end',
            rate.change24h > 0
              ? 'text-success'
              : rate.change24h < 0
              ? 'text-destructive'
              : 'text-muted-foreground'
          )}
        >
          {rate.change24h !== 0 && (
            rate.change24h > 0 ? (
              <TrendUp size={10} />
            ) : (
              <TrendDown size={10} />
            )
          )}
          {rate.change24h === 0 ? '—' : `${rate.change24h > 0 ? '+' : ''}${rate.change24h.toFixed(2)}%`}
        </div>
      </div>
    </motion.div>
  );
}

export function LiveRatesCard({ className }: LiveRatesCardProps) {
  const [lastUpdated, setLastUpdated] = useState('Just now');

  // Simulated real-time update indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated('Just now');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate effective crypto rate
  const effectiveCryptoRate = 1.2685 * 1.0 * 1578.25; // GBP → USD → USDT → NGN
  const traditionalRate = 1685.5;
  const savings = ((effectiveCryptoRate - traditionalRate) / traditionalRate) * 100;

  return (
    <Card className={cn('p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Live Rates</h3>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock size={10} />
          {lastUpdated}
        </div>
      </div>

      <div className="space-y-0">
        {liveRates.map((rate, index) => (
          <RateRow key={rate.pair} rate={rate} index={index} />
        ))}
      </div>

      {/* Effective Rate Comparison */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Effective GBP → NGN
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-500">
              Crypto
            </span>
            <span className="text-xs text-muted-foreground">vs</span>
            <span className="text-xs font-medium text-muted-foreground">
              Bank
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-emerald-500/10 p-2 border border-emerald-500/20">
            <p className="text-[10px] uppercase tracking-wide text-emerald-600 mb-0.5">
              Stablecoin Rail
            </p>
            <p className="text-lg font-bold text-emerald-600">
              {effectiveCryptoRate.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-[10px] text-emerald-600/70">NGN per £1</p>
          </div>
          <div className="rounded-lg bg-muted p-2 border border-border">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
              Traditional Bank
            </p>
            <p className="text-lg font-bold text-muted-foreground">
              {traditionalRate.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-[10px] text-muted-foreground/70">NGN per £1</p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-1 text-xs">
          <TrendUp size={14} className="text-success" />
          <span className="font-semibold text-success">
            {savings.toFixed(1)}% better
          </span>
          <span className="text-muted-foreground">via crypto rails</span>
        </div>
      </div>
    </Card>
  );
}
