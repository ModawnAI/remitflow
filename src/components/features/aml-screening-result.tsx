'use client';

import {
  ShieldWarning,
  CheckCircle,
  XCircle,
  Warning,
  UserFocus,
  Gavel,
  Newspaper,
  Gauge,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import type { AMLResult } from '@/types';
import { cn, formatRelativeTime } from '@/lib/utils';

export interface AMLScreeningResultProps {
  result: AMLResult | null;
  className?: string;
}

function RiskGauge({ score }: { score: number }) {
  const getRiskLevel = (score: number) => {
    if (score <= 25) return { label: 'Low', color: 'text-success', bgColor: 'bg-success' };
    if (score <= 50) return { label: 'Medium', color: 'text-warning', bgColor: 'bg-warning' };
    if (score <= 75) return { label: 'High', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    return { label: 'Critical', color: 'text-error', bgColor: 'bg-error' };
  };

  const risk = getRiskLevel(score);
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-40 overflow-hidden">
        {/* Background Arc */}
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full border-8 border-muted" />

        {/* Colored Segments */}
        <div className="absolute bottom-0 left-0 h-40 w-40 overflow-hidden rounded-full">
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-gradient-to-r from-success via-warning via-orange-500 to-error opacity-20" />
        </div>

        {/* Needle */}
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          className="absolute bottom-0 left-1/2 h-16 w-1 origin-bottom -translate-x-1/2"
        >
          <div className={cn('h-14 w-1 rounded-full', risk.bgColor)} />
          <div className={cn('mx-auto h-3 w-3 rounded-full', risk.bgColor)} />
        </motion.div>
      </div>

      <div className="mt-2 text-center">
        <p className={cn('text-2xl font-bold', risk.color)}>{score}</p>
        <p className={cn('text-sm font-medium', risk.color)}>{risk.label} Risk</p>
      </div>
    </div>
  );
}

function ScreeningItem({
  icon: Icon,
  label,
  matched,
  description,
}: {
  icon: React.ElementType;
  label: string;
  matched: boolean;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-3">
      <div className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        matched ? 'bg-error/10' : 'bg-success/10'
      )}>
        <Icon
          size={20}
          className={matched ? 'text-error' : 'text-success'}
          weight="fill"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {matched ? (
            <span className="flex items-center gap-1 rounded-full bg-error/10 px-2 py-0.5 text-xs font-medium text-error">
              <XCircle size={12} weight="fill" />
              Match Found
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              <CheckCircle size={12} weight="fill" />
              Clear
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function AMLScreeningResult({ result, className }: AMLScreeningResultProps) {
  if (!result) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="flex flex-col items-center py-8 text-center">
          <ShieldWarning size={48} className="text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            AML screening not completed
          </p>
          <p className="text-xs text-muted-foreground/70">
            Screening will be performed after document verification
          </p>
        </div>
      </div>
    );
  }

  const hasMatch = result.pepMatch || result.sanctionsMatch || result.adverseMediaMatch;

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldWarning size={20} className="text-accent" weight="fill" />
          <span className="font-medium text-foreground">AML Screening</span>
        </div>
        <div className="flex items-center gap-2">
          {hasMatch ? (
            <span className="flex items-center gap-1 rounded-full bg-error/10 px-2 py-1 text-xs font-medium text-error">
              <Warning size={14} weight="fill" />
              Review Required
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
              <CheckCircle size={14} weight="fill" />
              All Clear
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Risk Score */}
        <RiskGauge score={result.riskScore} />

        {/* Screening Results */}
        <div className="space-y-3">
          <ScreeningItem
            icon={UserFocus}
            label="PEP Check"
            matched={result.pepMatch}
            description={
              result.pepMatch
                ? 'Potential match found with Politically Exposed Person database'
                : 'No matches found in PEP database'
            }
          />
          <ScreeningItem
            icon={Gavel}
            label="Sanctions Screening"
            matched={result.sanctionsMatch}
            description={
              result.sanctionsMatch
                ? 'Potential match found with global sanctions lists'
                : 'No matches found in sanctions databases'
            }
          />
          <ScreeningItem
            icon={Newspaper}
            label="Adverse Media"
            matched={result.adverseMediaMatch}
            description={
              result.adverseMediaMatch
                ? 'Negative media coverage found - manual review required'
                : 'No concerning media coverage found'
            }
          />
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Screened</span>
          <span>{formatRelativeTime(result.screenedAt)}</span>
        </div>
      </div>
    </div>
  );
}
