'use client';

import dynamic from 'next/dynamic';
import type { KYCApplication } from '@/types';

const KYCQueuePageContent = dynamic(
  () => import('@/components/pages/kyc-queue-page-content').then((mod) => mod.KYCQueuePageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    ),
  }
);

interface KYCStats {
  pending: number;
  approvedToday: number;
  rejectedToday: number;
  averageReviewTime: string;
}

interface KYCQueuePageWrapperProps {
  stats: KYCStats;
  applications: KYCApplication[];
}

export function KYCQueuePageWrapper({ stats, applications }: KYCQueuePageWrapperProps) {
  return <KYCQueuePageContent stats={stats} applications={applications} />;
}
