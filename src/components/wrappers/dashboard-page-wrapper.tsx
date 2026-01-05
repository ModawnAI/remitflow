'use client';

import dynamic from 'next/dynamic';

const DashboardPageContent = dynamic(
  () => import('@/components/pages/dashboard-page-content').then((mod) => mod.DashboardPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-80 bg-muted rounded-xl" />
              <div className="h-80 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

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
  status: 'pending' | 'processing' | 'completed' | 'failed';
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
  severity: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  createdAt: string;
}

interface DashboardPageWrapperProps {
  metrics: Metric[];
  transactions: Transaction[];
  alerts: Alert[];
}

export function DashboardPageWrapper({ metrics, transactions, alerts }: DashboardPageWrapperProps) {
  return (
    <DashboardPageContent
      metrics={metrics}
      transactions={transactions}
      alerts={alerts}
    />
  );
}
