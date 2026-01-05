'use client';

import type { Route } from 'next';
import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { UserInfoCard } from '@/components/features/user-info-card';
import { DocumentViewer } from '@/components/features/document-viewer';
import { BiometricResultCard } from '@/components/features/biometric-result-card';
import { AMLScreeningResult } from '@/components/features/aml-screening-result';
import { KYCDecisionPanel } from '@/components/features/kyc-decision-panel';
import type { KYCDocument, BiometricResult, AMLResult, KYCStatus, KYCTier } from '@/types';

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

interface KYCReviewPageContentProps {
  application: KYCReviewApplication;
  userId: string;
}

export function KYCReviewPageContent({ application, userId }: KYCReviewPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={`KYC Review - ${application.user.name}`}
          description="Review identity documents and verification results"
          backLink={'/kyc' as Route}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UserInfoCard user={application.user} />

            <DocumentViewer documents={application.documents} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BiometricResultCard result={application.biometricResult} />
              <AMLScreeningResult result={application.amlResult} />
            </div>
          </div>

          <div>
            <KYCDecisionPanel
              userId={userId}
              userName={application.user.name}
              onApprove={async () => { /* TODO: Implement server action */ }}
              onReject={async () => { /* TODO: Implement server action */ }}
              onRequestAdditional={async () => { /* TODO: Implement server action */ }}
            />
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
