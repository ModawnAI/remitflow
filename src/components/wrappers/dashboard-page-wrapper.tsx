'use client';

import dynamic from 'next/dynamic';
import type { TransactionWithCrypto } from '@/types';

const DashboardPageContent = dynamic(
  () =>
    import('@/components/pages/dashboard-page-content').then(
      (mod) => mod.DashboardPageContent
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="h-4 w-64 bg-muted rounded" />
            </div>
            {/* Metrics skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-muted rounded-xl" />
              ))}
            </div>
            {/* Main content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-muted rounded-xl" />
                <div className="h-80 bg-muted rounded-xl" />
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-muted rounded-xl" />
                <div className="h-48 bg-muted rounded-xl" />
                <div className="h-40 bg-muted rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

interface Alert {
  id: string;
  severity: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  createdAt: string;
}

interface DashboardPageWrapperProps {
  transactions: TransactionWithCrypto[];
  alerts: Alert[];
}

export function DashboardPageWrapper({
  transactions,
  alerts,
}: DashboardPageWrapperProps) {
  return <DashboardPageContent transactions={transactions} alerts={alerts} />;
}
