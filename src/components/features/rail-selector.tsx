'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightning,
  Leaf,
  Bank,
  Check,
  Clock,
  Percent,
  CaretDown,
  CurrencyDollar,
  ArrowRight,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import type { RailComparison, RemittanceRail } from '@/types';
import {
  cn,
  formatCurrency,
  formatEstimatedTime,
  formatSavingsPercentage,
} from '@/lib/utils';

export interface RailSelectorProps {
  comparison: RailComparison;
  selectedRail: RemittanceRail;
  onRailChange: (rail: RemittanceRail) => void;
  sendAmount: number;
  className?: string;
}

interface RailOptionProps {
  rail: RemittanceRail;
  label: string;
  description: string;
  icon: React.ElementType;
  iconBgClass: string;
  receiveAmount: number;
  fees: number;
  feePercentage: number;
  estimatedTime: string;
  estimatedMinutes: number;
  savings?: number;
  savingsPercentage?: number;
  isSelected: boolean;
  isRecommended?: boolean;
  onSelect: () => void;
}

function RailOption({
  rail,
  label,
  description,
  icon: Icon,
  iconBgClass,
  receiveAmount,
  fees,
  feePercentage,
  estimatedTime,
  estimatedMinutes,
  savings,
  savingsPercentage,
  isSelected,
  isRecommended,
  onSelect,
}: RailOptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-xl border-2 transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-primary/50'
      )}
      onClick={onSelect}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-success text-[10px] font-semibold text-white uppercase tracking-wide">
          Recommended
        </div>
      )}

      {/* Savings badge */}
      {savingsPercentage !== undefined && savingsPercentage > 0 && (
        <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-success/10 text-[10px] font-semibold text-success">
          Save {formatSavingsPercentage(savingsPercentage)}
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              iconBgClass
            )}
          >
            <Icon size={20} weight="bold" className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{label}</h3>
              {isSelected && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check size={12} weight="bold" className="text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(receiveAmount, 'NGN', { maximumFractionDigits: 0 })}
            </p>
            {savings !== undefined && savings > 0 && (
              <p className="text-xs text-success font-medium">
                +{formatCurrency(savings, 'NGN', { maximumFractionDigits: 0 })} more
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={14} />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Percent size={14} />
            <span>{feePercentage}% fee</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="ml-auto flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <span>Details</span>
            <CaretDown
              size={14}
              className={cn('transition-transform', isExpanded && 'rotate-180')}
            />
          </button>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                {rail === 'traditional' ? (
                  <>
                    <DetailRow
                      label="Bank processing"
                      value={`1-3 business days`}
                    />
                    <DetailRow
                      label="Transfer fee"
                      value={formatCurrency(fees, 'GBP')}
                    />
                    <DetailRow
                      label="Exchange rate markup"
                      value="~4.5%"
                    />
                  </>
                ) : (
                  <>
                    <DetailRow
                      label="GBP → USD (Revolut)"
                      value="0.4% fee, ~2 min"
                      highlight
                    />
                    <DetailRow
                      label="USD → USDT (1:1)"
                      value="No fee, ~1 min"
                      highlight
                    />
                    <DetailRow
                      label="USDT → NGN (Yellow Card)"
                      value={`${rail === 'crypto_fast' ? '1.5%' : '1.0%'} fee, ~${rail === 'crypto_fast' ? '8' : '60'} min`}
                      highlight
                    />
                    <DetailRow
                      label="Network"
                      value={rail === 'crypto_fast' ? 'Polygon (fast)' : 'Tron (batched)'}
                    />
                  </>
                )}
                <div className="pt-2 mt-2 border-t border-border">
                  <DetailRow
                    label="Total fees"
                    value={formatCurrency(fees, 'GBP')}
                    bold
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  bold,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className={cn('text-muted-foreground', highlight && 'flex items-center gap-1')}>
        {highlight && <ArrowRight size={10} className="text-primary" />}
        {label}
      </span>
      <span className={cn('text-foreground', bold && 'font-semibold')}>
        {value}
      </span>
    </div>
  );
}

export function RailSelector({
  comparison,
  selectedRail,
  onRailChange,
  sendAmount,
  className,
}: RailSelectorProps) {
  // Determine recommended rail (highest savings)
  const recommendedRail: RemittanceRail =
    comparison.cryptoCheap.savings > comparison.cryptoFast.savings
      ? 'crypto_cheap'
      : 'crypto_fast';

  return (
    <Card className={cn('p-4', className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Choose Payment Rail</h2>
        <p className="text-sm text-muted-foreground">
          Select how you want to send {formatCurrency(sendAmount, 'GBP')} to Nigeria
        </p>
      </div>

      <div className="space-y-3">
        {/* Crypto Fast */}
        <RailOption
          rail="crypto_fast"
          label="Crypto Express"
          description="Fastest delivery via stablecoins"
          icon={Lightning}
          iconBgClass="bg-amber-500"
          receiveAmount={comparison.cryptoFast.receiveAmount}
          fees={comparison.cryptoFast.fees}
          feePercentage={comparison.cryptoFast.feePercentage}
          estimatedTime={comparison.cryptoFast.estimatedTime}
          estimatedMinutes={comparison.cryptoFast.estimatedMinutes}
          savings={comparison.cryptoFast.savings}
          savingsPercentage={comparison.cryptoFast.savingsPercentage}
          isSelected={selectedRail === 'crypto_fast'}
          isRecommended={recommendedRail === 'crypto_fast'}
          onSelect={() => onRailChange('crypto_fast')}
        />

        {/* Crypto Cheap */}
        <RailOption
          rail="crypto_cheap"
          label="Crypto Saver"
          description="Best value with batched processing"
          icon={Leaf}
          iconBgClass="bg-emerald-500"
          receiveAmount={comparison.cryptoCheap.receiveAmount}
          fees={comparison.cryptoCheap.fees}
          feePercentage={comparison.cryptoCheap.feePercentage}
          estimatedTime={comparison.cryptoCheap.estimatedTime}
          estimatedMinutes={comparison.cryptoCheap.estimatedMinutes}
          savings={comparison.cryptoCheap.savings}
          savingsPercentage={comparison.cryptoCheap.savingsPercentage}
          isSelected={selectedRail === 'crypto_cheap'}
          isRecommended={recommendedRail === 'crypto_cheap'}
          onSelect={() => onRailChange('crypto_cheap')}
        />

        {/* Traditional */}
        <RailOption
          rail="traditional"
          label="Bank Transfer"
          description="Standard international wire transfer"
          icon={Bank}
          iconBgClass="bg-slate-500"
          receiveAmount={comparison.traditional.receiveAmount}
          fees={comparison.traditional.fees}
          feePercentage={comparison.traditional.feePercentage}
          estimatedTime={comparison.traditional.estimatedTime}
          estimatedMinutes={comparison.traditional.estimatedMinutes}
          isSelected={selectedRail === 'traditional'}
          onSelect={() => onRailChange('traditional')}
        />
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 rounded-lg bg-muted/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Selected rail</span>
          <span className="font-medium text-foreground">
            {selectedRail === 'crypto_fast'
              ? 'Crypto Express'
              : selectedRail === 'crypto_cheap'
              ? 'Crypto Saver'
              : 'Bank Transfer'}
          </span>
        </div>
        {selectedRail !== 'traditional' && (
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">You save vs bank transfer</span>
            <span className="font-semibold text-success">
              {formatCurrency(
                selectedRail === 'crypto_fast'
                  ? comparison.cryptoFast.savings
                  : comparison.cryptoCheap.savings,
                'NGN',
                { maximumFractionDigits: 0 }
              )}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
