'use client';

import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { MetricsGrid } from '@/components/features/metrics-grid';
import { TransactionTable } from '@/components/features/transaction-table';
import { AlertsList } from '@/components/features/alerts-list';
import { PageHeader } from '@/components/layouts/page-header';

interface Metric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

interface Transaction {
  id: string;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  senderId: string;
  senderName: string;
  senderPhone: string;
  recipientId: string;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: string;
}

interface DashboardPageContentProps {
  metrics: Metric[];
  transactions: Transaction[];
  alerts: Alert[];
}

export function DashboardPageContent({ metrics, transactions, alerts }: DashboardPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Overview of transactions and key metrics"
        />

        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Recent Transactions
              </h2>
              <TransactionTable transactions={transactions} />
            </div>
          </div>

          <div>
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
