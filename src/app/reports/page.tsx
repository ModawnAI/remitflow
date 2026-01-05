import type { Metadata } from 'next';
import { ReportsPageWrapper } from '@/components/wrappers/reports-page-wrapper';

export const metadata: Metadata = {
  title: 'Reports | RemitFlow Admin',
  description: 'Generate and view transaction reports',
};

const mockSavedReports = [
  {
    id: 'rpt-001',
    name: 'Weekly Transaction Summary',
    type: 'transactions' as const,
    dateRange: {
      from: new Date(Date.now() - 86400000 * 7).toISOString(),
      to: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    createdBy: 'Admin User',
    status: 'completed' as const,
    downloadUrl: '/reports/weekly-summary.pdf',
  },
  {
    id: 'rpt-002',
    name: 'Monthly Volume Report',
    type: 'volume' as const,
    dateRange: {
      from: new Date(Date.now() - 86400000 * 30).toISOString(),
      to: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'Admin User',
    status: 'completed' as const,
    downloadUrl: '/reports/monthly-volume.pdf',
  },
  {
    id: 'rpt-003',
    name: 'KYC Compliance Report',
    type: 'kyc' as const,
    dateRange: {
      from: new Date(Date.now() - 86400000 * 30).toISOString(),
      to: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'Compliance Officer',
    status: 'completed' as const,
    downloadUrl: '/reports/kyc-compliance.pdf',
  },
  {
    id: 'rpt-004',
    name: 'Failed Transactions Analysis',
    type: 'failed' as const,
    dateRange: {
      from: new Date(Date.now() - 86400000 * 14).toISOString(),
      to: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdBy: 'Operations Manager',
    status: 'generating' as const,
  },
];

export default async function ReportsPage() {
  return <ReportsPageWrapper reports={mockSavedReports} />;
}
