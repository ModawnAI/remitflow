'use client';

import dynamic from 'next/dynamic';

const ReportsPageContent = dynamic(
  () => import('@/components/pages/reports-page-content').then((mod) => mod.ReportsPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-28 bg-muted rounded" />
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

interface SavedReport {
  id: string;
  name: string;
  type: 'transactions' | 'volume' | 'kyc' | 'failed';
  dateRange: {
    from: string;
    to: string;
  };
  createdAt: string;
  createdBy: string;
  status: 'completed' | 'generating' | 'failed';
  downloadUrl?: string;
}

interface ReportsPageWrapperProps {
  reports: SavedReport[];
}

export function ReportsPageWrapper({ reports }: ReportsPageWrapperProps) {
  return <ReportsPageContent reports={reports} />;
}
