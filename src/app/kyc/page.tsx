import type { Metadata } from 'next';
import { KYCQueuePageWrapper } from '@/components/wrappers/kyc-queue-page-wrapper';
import type { KYCApplication } from '@/types';

export const metadata: Metadata = {
  title: 'KYC Review | RemitFlow Admin',
  description: 'Review and approve KYC applications',
};

const mockStats = {
  pending: 23,
  approvedToday: 45,
  rejectedToday: 3,
  averageReviewTime: '4.5 mins',
};

const mockApplications: KYCApplication[] = [
  {
    id: 'KYC-001',
    userId: 'usr-001',
    userName: 'James Okafor',
    userPhone: '+44 7700 900010',
    status: 'pending',
    tier: 'standard',
    documents: [
      { id: 'doc-1', type: 'passport', url: '/placeholder.jpg', status: 'pending', uploadedAt: new Date().toISOString() },
    ],
    biometricResult: { provider: 'smile_id', matchScore: 94, livenessScore: 97, passed: true, verifiedAt: new Date().toISOString() },
    submittedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'KYC-002',
    userId: 'usr-002',
    userName: 'Fatima Ahmed',
    userPhone: '+44 7700 900011',
    status: 'pending',
    tier: 'standard',
    documents: [
      { id: 'doc-2', type: 'driving_license', url: '/placeholder.jpg', status: 'pending', uploadedAt: new Date().toISOString() },
    ],
    biometricResult: { provider: 'smile_id', matchScore: 89, livenessScore: 95, passed: true, verifiedAt: new Date().toISOString() },
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'KYC-003',
    userId: 'usr-003',
    userName: 'Chen Wei',
    userPhone: '+44 7700 900012',
    status: 'pending',
    tier: 'basic',
    documents: [
      { id: 'doc-3', type: 'national_id', url: '/placeholder.jpg', status: 'pending', uploadedAt: new Date().toISOString() },
    ],
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'KYC-004',
    userId: 'usr-004',
    userName: 'Mohammed Ali',
    userPhone: '+44 7700 900013',
    status: 'pending',
    tier: 'enhanced',
    documents: [
      { id: 'doc-4', type: 'passport', url: '/placeholder.jpg', status: 'pending', uploadedAt: new Date().toISOString() },
      { id: 'doc-5', type: 'proof_of_address', url: '/placeholder.jpg', status: 'pending', uploadedAt: new Date().toISOString() },
    ],
    amlResult: { pepMatch: false, sanctionsMatch: false, adverseMediaMatch: true, riskScore: 45, screenedAt: new Date().toISOString() },
    submittedAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

export default async function KYCQueuePage() {
  return (
    <KYCQueuePageWrapper
      stats={mockStats}
      applications={mockApplications}
    />
  );
}
