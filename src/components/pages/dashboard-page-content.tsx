'use client';

import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { TransactionTable } from '@/components/features/transaction-table';
import { AlertsList } from '@/components/features/alerts-list';
import { PageHeader } from '@/components/layouts/page-header';
import {
  CryptoDashboardMetrics,
  RailBreakdownCard,
} from '@/components/features/crypto-dashboard-metrics';
import { IntegrationStatus } from '@/components/features/integration-status';
import { LiveRatesCard } from '@/components/features/live-rates-card';
import { SavingsHighlight } from '@/components/features/savings-highlight';
import type { TransactionWithCrypto } from '@/types';

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: string;
}

interface DashboardPageContentProps {
  transactions: TransactionWithCrypto[];
  alerts: Alert[];
}

export function DashboardPageContent({
  transactions,
  alerts,
}: DashboardPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Stablecoin Dashboard"
          description="Real-time overview of crypto remittance transactions via Revolut X"
        />

        {/* Crypto-focused metrics */}
        <CryptoDashboardMetrics transactions={transactions} />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Recent transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Savings Highlight */}
            <SavingsHighlight transactions={transactions} />

            {/* Recent Transactions */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Recent Crypto Transactions
              </h2>
              <TransactionTable transactions={transactions} />
            </div>
          </div>

          {/* Right column - Status cards */}
          <div className="space-y-6">
            {/* Live Rates */}
            <LiveRatesCard />

            {/* Integration Status */}
            <IntegrationStatus />

            {/* Rail Distribution */}
            <RailBreakdownCard transactions={transactions} />

            {/* Alerts */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Alerts
              </h2>
              <AlertsList alerts={alerts} />
            </div>
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
