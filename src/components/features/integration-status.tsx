'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Warning,
  XCircle,
  ArrowsClockwise,
  Lightning,
  Clock,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface IntegrationStatusProps {
  className?: string;
}

type IntegrationHealth = 'healthy' | 'degraded' | 'down';

interface Integration {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: IntegrationHealth;
  latency?: number;
  lastCheck: string;
  features: string[];
}

const integrations: Integration[] = [
  {
    id: 'revolut',
    name: 'Revolut X',
    logo: '/logos/revolut.svg',
    description: 'FX & Stablecoin Bridge',
    status: 'healthy',
    latency: 145,
    lastCheck: '30s ago',
    features: ['GBP → USD FX', 'USD ↔ USDT (1:1)', 'API v2'],
  },
  {
    id: 'yellow_card',
    name: 'Yellow Card',
    logo: '/logos/yellowcard.svg',
    description: 'Africa Off-ramp',
    status: 'healthy',
    latency: 320,
    lastCheck: '45s ago',
    features: ['USDT → NGN', 'Bank Payout', 'KYC Verified'],
  },
];

function StatusIcon({ status }: { status: IntegrationHealth }) {
  switch (status) {
    case 'healthy':
      return <CheckCircle size={18} weight="fill" className="text-success" />;
    case 'degraded':
      return <Warning size={18} weight="fill" className="text-warning" />;
    case 'down':
      return <XCircle size={18} weight="fill" className="text-destructive" />;
  }
}

function StatusBadge({ status }: { status: IntegrationHealth }) {
  const styles = {
    healthy: 'bg-success/10 text-success border-success/20',
    degraded: 'bg-warning/10 text-warning border-warning/20',
    down: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const labels = {
    healthy: 'Operational',
    degraded: 'Degraded',
    down: 'Offline',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        styles[status]
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'healthy' && 'bg-success animate-pulse',
          status === 'degraded' && 'bg-warning animate-pulse',
          status === 'down' && 'bg-destructive'
        )}
      />
      {labels[status]}
    </span>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3',
        integration.status === 'healthy'
          ? 'border-border bg-card'
          : integration.status === 'degraded'
          ? 'border-warning/30 bg-warning/5'
          : 'border-destructive/30 bg-destructive/5'
      )}
    >
      {/* Logo placeholder */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <span className="text-lg font-bold text-muted-foreground">
          {integration.name.charAt(0)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-foreground">{integration.name}</h4>
            <p className="text-xs text-muted-foreground">
              {integration.description}
            </p>
          </div>
          <StatusBadge status={integration.status} />
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {integration.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
          {integration.latency && (
            <span className="flex items-center gap-0.5">
              <Lightning size={10} />
              {integration.latency}ms
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <Clock size={10} />
            {integration.lastCheck}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function IntegrationStatus({ className }: IntegrationStatusProps) {
  const allHealthy = integrations.every((i) => i.status === 'healthy');

  return (
    <Card className={cn('p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Integration Status
        </h3>
        <div className="flex items-center gap-1.5">
          {allHealthy ? (
            <>
              <CheckCircle size={14} weight="fill" className="text-success" />
              <span className="text-xs text-success font-medium">All Systems Go</span>
            </>
          ) : (
            <>
              <Warning size={14} weight="fill" className="text-warning" />
              <span className="text-xs text-warning font-medium">Issues Detected</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      {/* Flow visualization */}
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
          Transaction Flow
        </p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">GBP</span>
          </div>
          <ArrowsClockwise size={12} className="text-muted-foreground" />
          <div className="flex items-center gap-1">
            <span className="font-medium text-blue-500">USD</span>
            <span className="text-[10px] text-muted-foreground">(Revolut)</span>
          </div>
          <ArrowsClockwise size={12} className="text-muted-foreground" />
          <div className="flex items-center gap-1">
            <span className="font-medium text-emerald-500">USDT</span>
            <span className="text-[10px] text-muted-foreground">(1:1)</span>
          </div>
          <ArrowsClockwise size={12} className="text-muted-foreground" />
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">NGN</span>
            <span className="text-[10px] text-muted-foreground">(YC)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
