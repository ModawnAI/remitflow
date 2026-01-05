'use client';

import {
  UserCircle,
  CheckCircle,
  XCircle,
  SmileyWink,
  IdentificationCard,
  ShieldCheck,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import type { BiometricResult } from '@/types';
import { cn, formatRelativeTime } from '@/lib/utils';

export interface BiometricResultCardProps {
  result: BiometricResult | null;
  className?: string;
}

function ScoreBar({
  score,
  threshold = 70,
  label,
}: {
  score: number;
  threshold?: number;
  label: string;
}) {
  const isPassing = score >= threshold;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-medium', isPassing ? 'text-success' : 'text-error')}>
          {score}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            score >= 90
              ? 'bg-success'
              : score >= threshold
              ? 'bg-accent'
              : score >= 50
              ? 'bg-warning'
              : 'bg-error'
          )}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span className="border-l border-border pl-1">
          Threshold: {threshold}%
        </span>
        <span>100%</span>
      </div>
    </div>
  );
}

export function BiometricResultCard({ result, className }: BiometricResultCardProps) {
  if (!result) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="flex flex-col items-center py-8 text-center">
          <UserCircle size={48} className="text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            Biometric verification not completed
          </p>
          <p className="text-xs text-muted-foreground/70">
            User has not submitted selfie verification yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-accent" weight="fill" />
          <span className="font-medium text-foreground">Biometric Verification</span>
        </div>
        <div className="flex items-center gap-2">
          {result.passed ? (
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
              <CheckCircle size={14} weight="fill" />
              Passed
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-error/10 px-2 py-1 text-xs font-medium text-error">
              <XCircle size={14} weight="fill" />
              Failed
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Provider Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Provider</span>
          <span className="font-medium text-foreground capitalize">
            {result.provider.replace('_', ' ')}
          </span>
        </div>

        {/* Scores */}
        <div className="space-y-4">
          <ScoreBar
            score={result.matchScore}
            threshold={70}
            label="Face Match Score"
          />
          <ScoreBar
            score={result.livenessScore}
            threshold={80}
            label="Liveness Score"
          />
        </div>

        {/* Verification Details */}
        <div className="rounded-lg bg-muted p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              result.matchScore >= 70 ? 'bg-success/10' : 'bg-error/10'
            )}>
              <IdentificationCard
                size={20}
                className={result.matchScore >= 70 ? 'text-success' : 'text-error'}
                weight="fill"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Face Matching</p>
              <p className="text-xs text-muted-foreground">
                {result.matchScore >= 70
                  ? 'Selfie matches the ID document photo'
                  : 'Selfie does not match ID document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              result.livenessScore >= 80 ? 'bg-success/10' : 'bg-error/10'
            )}>
              <SmileyWink
                size={20}
                className={result.livenessScore >= 80 ? 'text-success' : 'text-error'}
                weight="fill"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Liveness Detection</p>
              <p className="text-xs text-muted-foreground">
                {result.livenessScore >= 80
                  ? 'Live person detected, not a photo or video'
                  : 'Could not confirm live person'}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Verified</span>
          <span>{formatRelativeTime(result.verifiedAt)}</span>
        </div>
      </div>
    </div>
  );
}
