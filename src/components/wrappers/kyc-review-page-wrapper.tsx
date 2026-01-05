'use client';

import dynamic from 'next/dynamic';
import type { KYCDocument, BiometricResult, AMLResult, KYCStatus, KYCTier } from '@/types';

const KYCReviewPageContent = dynamic(
  () => import('@/components/pages/kyc-review-page-content').then((mod) => mod.KYCReviewPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-muted rounded-xl" />
                <div className="h-80 bg-muted rounded-xl" />
              </div>
              <div className="h-60 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

interface KYCReviewUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycStatus: KYCStatus;
  kycTier: KYCTier;
  createdAt: string;
  lastActiveAt: string;
  transactionLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
}

interface KYCReviewApplication {
  id: string;
  userId: string;
  user: KYCReviewUser;
  documents: KYCDocument[];
  biometricResult: BiometricResult;
  amlResult: AMLResult;
  submittedAt: string;
  status: KYCStatus;
}

interface KYCReviewPageWrapperProps {
  application: KYCReviewApplication;
  userId: string;
}

export function KYCReviewPageWrapper({ application, userId }: KYCReviewPageWrapperProps) {
  return <KYCReviewPageContent application={application} userId={userId} />;
}
