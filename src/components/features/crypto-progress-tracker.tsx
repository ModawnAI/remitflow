'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Clock,
  Spinner,
  Warning,
  ArrowRight,
  CurrencyGbp,
  CurrencyDollar,
  Coins,
  Bank,
  Lightning,
  ArrowsClockwise,
  Link,
  CaretDown,
  Info,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import type { CryptoTransactionDetails, CryptoLeg, CryptoStage } from '@/types';
import {
  cn,
  formatCurrency,
  formatCryptoAmount,
  getCryptoStageInfo,
  getCryptoProgressPercentage,
  getProviderDisplayName,
} from '@/lib/utils';

export interface CryptoProgressTrackerProps {
  crypto: CryptoTransactionDetails;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  className?: string;
}

interface StageIndicatorProps {
  stage: CryptoStage;
  currentStage: CryptoStage;
  label: string;
  description: string;
}

function StageIndicator({ stage, currentStage, label, description }: StageIndicatorProps) {
  const stageOrder: CryptoStage[] = [
    'initiated',
    'gbp_received',
    'converting_to_usd',
    'usd_converted',
    'converting_to_usdt',
    'usdt_acquired',
    'sending_to_offramp',
    'offramp_processing',
    'ngn_disbursed',
    'completed',
  ];

  const currentIndex = stageOrder.indexOf(currentStage);
  const stageIndex = stageOrder.indexOf(stage);
  const isCompleted = stageIndex < currentIndex || currentStage === 'completed';
  const isCurrent = stage === currentStage;
  const isFailed = currentStage === 'failed';

  return (
    <div className="flex items-start gap-3">
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
            isCompleted && 'border-success bg-success text-white',
            isCurrent && !isFailed && 'border-primary bg-primary text-white',
            isCurrent && isFailed && 'border-destructive bg-destructive text-white',
            !isCompleted && !isCurrent && 'border-muted-foreground/30 bg-muted text-muted-foreground'
          )}
        >
          {isCompleted ? (
            <Check size={16} weight="bold" />
          ) : isCurrent && isFailed ? (
            <Warning size={16} weight="bold" />
          ) : isCurrent ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Spinner size={16} weight="bold" />
            </motion.div>
          ) : (
            <span className="text-xs font-medium">{stageIndex + 1}</span>
          )}
        </motion.div>
        {stageIndex < stageOrder.length - 1 && (
          <div
            className={cn(
              'h-8 w-0.5 my-1',
              isCompleted ? 'bg-success' : 'bg-muted-foreground/20'
            )}
          />
        )}
      </div>
      <div className="flex-1 pb-6">
        <p
          className={cn(
            'font-medium text-sm',
            isCompleted && 'text-success',
            isCurrent && !isFailed && 'text-primary',
            isCurrent && isFailed && 'text-destructive',
            !isCompleted && !isCurrent && 'text-muted-foreground'
          )}
        >
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface LegCardProps {
  leg: CryptoLeg;
  index: number;
}

function LegCard({ leg, index }: LegCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = () => {
    switch (leg.type) {
      case 'fiat_conversion':
        return ArrowsClockwise;
      case 'stablecoin_mint':
        return Coins;
      case 'blockchain_transfer':
        return Lightning;
      case 'offramp':
        return Bank;
      default:
        return ArrowRight;
    }
  };

  const getTypeLabel = () => {
    switch (leg.type) {
      case 'fiat_conversion':
        return 'Currency Exchange';
      case 'stablecoin_mint':
        return 'Stablecoin Conversion';
      case 'blockchain_transfer':
        return 'Blockchain Transfer';
      case 'offramp':
        return 'Off-ramp to Bank';
      default:
        return leg.type;
    }
  };

  const Icon = getTypeIcon();

  const statusColors = {
    pending: 'bg-muted text-muted-foreground',
    processing: 'bg-primary/10 text-primary border-primary/30',
    completed: 'bg-success/10 text-success border-success/30',
    failed: 'bg-destructive/10 text-destructive border-destructive/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'rounded-lg border p-3 transition-colors',
        statusColors[leg.status]
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            leg.status === 'completed' && 'bg-success/20',
            leg.status === 'processing' && 'bg-primary/20',
            leg.status === 'pending' && 'bg-muted-foreground/20',
            leg.status === 'failed' && 'bg-destructive/20'
          )}
        >
          <Icon size={18} weight="bold" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{getTypeLabel()}</h4>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full',
                  leg.status === 'completed' && 'bg-success text-white',
                  leg.status === 'processing' && 'bg-primary text-white',
                  leg.status === 'pending' && 'bg-muted-foreground text-white',
                  leg.status === 'failed' && 'bg-destructive text-white'
                )}
              >
                {leg.status}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-0.5">
            via {getProviderDisplayName(leg.provider)}
          </p>

          {/* Amount transformation */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="font-mono">
              {leg.inputCurrency === 'USDT' || leg.inputCurrency === 'USDC'
                ? formatCryptoAmount(leg.inputAmount, leg.inputCurrency)
                : formatCurrency(leg.inputAmount, leg.inputCurrency)}
            </span>
            <ArrowRight size={12} className="text-muted-foreground" />
            <span className="font-mono font-medium">
              {leg.outputCurrency === 'USDT' || leg.outputCurrency === 'USDC'
                ? formatCryptoAmount(leg.outputAmount, leg.outputCurrency)
                : formatCurrency(leg.outputAmount, leg.outputCurrency)}
            </span>
          </div>

          {/* Expandable details */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-2"
          >
            <span>Details</span>
            <CaretDown
              size={12}
              className={cn('transition-transform', isExpanded && 'rotate-180')}
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2 pt-2 border-t border-current/10 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span>
                      {formatCurrency(leg.fee, leg.inputCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Duration</span>
                    <span>
                      {leg.estimatedDuration < 60
                        ? `${leg.estimatedDuration}s`
                        : `${Math.floor(leg.estimatedDuration / 60)}m`}
                    </span>
                  </div>
                  {leg.txHash && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tx Hash</span>
                      <a
                        href={`https://polygonscan.com/tx/${leg.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-mono">
                          {leg.txHash.slice(0, 8)}...{leg.txHash.slice(-6)}
                        </span>
                        <Link size={10} />
                      </a>
                    </div>
                  )}
                  {leg.startedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started</span>
                      <span>
                        {new Date(leg.startedAt).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                  {leg.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed</span>
                      <span>
                        {new Date(leg.completedAt).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export function CryptoProgressTracker({
  crypto,
  sendAmount,
  sendCurrency,
  receiveAmount,
  receiveCurrency,
  className,
}: CryptoProgressTrackerProps) {
  const [showAllStages, setShowAllStages] = useState(false);
  const progressPercentage = getCryptoProgressPercentage(crypto.stage);
  const stageInfo = getCryptoStageInfo(crypto.stage);

  // Simplified stages for timeline view
  const keyStages: { stage: CryptoStage; label: string; description: string }[] = [
    { stage: 'gbp_received', label: 'Payment Received', description: 'GBP confirmed' },
    { stage: 'usd_converted', label: 'USD Ready', description: 'Converted via Revolut' },
    { stage: 'usdt_acquired', label: 'USDT Acquired', description: '1:1 stablecoin mint' },
    { stage: 'offramp_processing', label: 'Off-ramp', description: 'Yellow Card processing' },
    { stage: 'completed', label: 'Completed', description: 'NGN delivered' },
  ];

  const networkLabels: Record<string, string> = {
    polygon: 'Polygon (MATIC)',
    tron: 'Tron (TRC-20)',
    ethereum: 'Ethereum (ERC-20)',
    solana: 'Solana (SPL)',
  };

  return (
    <Card className={cn('p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Transaction Progress</h2>
          <p className="text-sm text-muted-foreground">
            {crypto.rail === 'crypto_fast' ? 'Crypto Express' : 'Crypto Saver'} Rail
          </p>
        </div>
        <div
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold',
            crypto.stage === 'completed' && 'bg-success/10 text-success',
            crypto.stage === 'failed' && 'bg-destructive/10 text-destructive',
            crypto.stage !== 'completed' &&
              crypto.stage !== 'failed' &&
              'bg-primary/10 text-primary'
          )}
        >
          {stageInfo.label}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              crypto.stage === 'completed' && 'bg-success',
              crypto.stage === 'failed' && 'bg-destructive',
              crypto.stage !== 'completed' && crypto.stage !== 'failed' && 'bg-primary'
            )}
          />
        </div>
      </div>

      {/* Amount summary */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <CurrencyGbp size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sending</p>
            <p className="font-semibold text-sm">
              {formatCurrency(sendAmount, sendCurrency)}
            </p>
          </div>
        </div>
        <ArrowRight size={20} className="text-muted-foreground" />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
            <Bank size={16} className="text-success" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Receiving</p>
            <p className="font-semibold text-sm">
              {formatCurrency(receiveAmount, receiveCurrency, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Savings badge */}
      {crypto.savingsPercentage > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-success/10 text-success text-xs mb-4">
          <Info size={14} />
          <span>
            Saving{' '}
            <strong>
              {formatCurrency(crypto.savingsVsTraditional, 'NGN', {
                maximumFractionDigits: 0,
              })}
            </strong>{' '}
            ({crypto.savingsPercentage.toFixed(1)}%) vs traditional bank transfer
          </span>
        </div>
      )}

      {/* Network info */}
      {crypto.blockchainNetwork && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Lightning size={14} />
          <span>Network: {networkLabels[crypto.blockchainNetwork] || crypto.blockchainNetwork}</span>
          {crypto.stablecoin && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <Coins size={14} />
              <span>Stablecoin: {crypto.stablecoin}</span>
            </>
          )}
        </div>
      )}

      {/* Stage timeline */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Timeline</h3>
          <button
            type="button"
            onClick={() => setShowAllStages(!showAllStages)}
            className="text-xs text-primary hover:text-primary/80"
          >
            {showAllStages ? 'Show less' : 'Show all stages'}
          </button>
        </div>
        <div className="pl-1">
          {keyStages.map((s) => (
            <StageIndicator
              key={s.stage}
              stage={s.stage}
              currentStage={crypto.stage}
              label={s.label}
              description={s.description}
            />
          ))}
        </div>
      </div>

      {/* Transaction legs */}
      {crypto.legs.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Transaction Legs</h3>
          <div className="space-y-2">
            {crypto.legs.map((leg, index) => (
              <LegCard key={leg.id} leg={leg} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Estimated completion */}
      {crypto.stage !== 'completed' && crypto.stage !== 'failed' && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={14} />
          <span>Estimated completion: {crypto.estimatedCompletionTime}</span>
        </div>
      )}

      {/* Total fees */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total crypto fees</span>
        <span className="font-semibold">
          {formatCurrency(crypto.totalCryptoFees, 'GBP')}
        </span>
      </div>
    </Card>
  );
}
