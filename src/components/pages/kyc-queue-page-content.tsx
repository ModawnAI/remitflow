'use client';

import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { KYCStatsBar } from '@/components/features/kyc-stats-bar';
import { KYCReviewTable } from '@/components/features/kyc-review-table';
import type { KYCApplication } from '@/types';

interface KYCStats {
  pending: number;
  approvedToday: number;
  rejectedToday: number;
  averageReviewTime: string;
}

interface KYCQueuePageContentProps {
  stats: KYCStats;
  applications: KYCApplication[];
}

export function KYCQueuePageContent({ stats, applications }: KYCQueuePageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="KYC Review Queue"
          description="Review and process pending KYC applications"
        />

        <KYCStatsBar stats={stats} />

        <div className="bg-white rounded-xl border border-neutral-200">
          <KYCReviewTable applications={applications} />
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
