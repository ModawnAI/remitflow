import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KYCReviewPageWrapper } from '@/components/wrappers/kyc-review-page-wrapper';

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  return {
    title: `KYC Review - User ${userId} | RemitFlow Admin`,
    description: 'Review KYC application documents',
  };
}

// Mock data - replace with Supabase query
async function getKYCApplication(userId: string) {
  const mockApplication = {
    id: `KYC-${userId}`,
    userId,
    user: {
      id: userId,
      name: 'James Okafor',
      phone: '+44 7700 900010',
      email: 'james.okafor@email.com',
      kycStatus: 'pending' as const,
      kycTier: 'standard' as const,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
      transactionLimit: 2000,
      dailyLimit: 5000,
      monthlyLimit: 25000,
    },
    documents: [
      {
        id: 'doc-1',
        type: 'passport' as const,
        url: '/placeholder-document.jpg',
        status: 'pending' as const,
        uploadedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'doc-2',
        type: 'selfie' as const,
        url: '/placeholder-selfie.jpg',
        status: 'approved' as const,
        uploadedAt: new Date(Date.now() - 3500000).toISOString(),
      },
    ],
    biometricResult: {
      provider: 'smile_id' as const,
      matchScore: 94,
      livenessScore: 98,
      passed: true,
      verifiedAt: new Date(Date.now() - 3400000).toISOString(),
    },
    amlResult: {
      pepMatch: false,
      sanctionsMatch: false,
      adverseMediaMatch: false,
      riskScore: 15,
      screenedAt: new Date(Date.now() - 3300000).toISOString(),
    },
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'pending' as const,
  };

  if (!userId.startsWith('usr-')) {
    return null;
  }

  return mockApplication;
}

export default async function KYCReviewPage({ params }: Props) {
  const { userId } = await params;
  const application = await getKYCApplication(userId);

  if (!application) {
    notFound();
  }

  return <KYCReviewPageWrapper application={application} userId={userId} />;
}
