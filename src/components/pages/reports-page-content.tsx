'use client';

import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { ReportGenerator } from '@/components/features/report-generator';
import { SavedReportsList } from '@/components/features/saved-reports-list';

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

interface ReportsPageContentProps {
  reports: SavedReport[];
}

export function ReportsPageContent({ reports }: ReportsPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Reports"
          description="Generate and download transaction reports"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SavedReportsList reports={reports} />
          </div>

          <div>
            <ReportGenerator />
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
