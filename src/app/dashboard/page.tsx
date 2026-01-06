import type { Metadata } from 'next';
import { DashboardPageWrapper } from '@/components/wrappers/dashboard-page-wrapper';
import { generateMockCryptoTransactions } from '@/lib/crypto-mock-data';

export const metadata: Metadata = {
  title: 'Stablecoin Dashboard | RemitFlow Admin',
  description: 'Real-time crypto remittance monitoring via Revolut X',
};

// Generate crypto-focused mock transactions with USDT/stablecoin data
const transactions = generateMockCryptoTransactions();

const mockAlerts = [
  {
    id: 'ALERT-001',
    severity: 'info' as const,
    title: 'Revolut X Connection Active',
    message: 'All stablecoin conversions processing at 1:1 USD/USDT rate',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ALERT-002',
    severity: 'warning' as const,
    title: 'Yellow Card Rate Update',
    message: 'USDT/NGN rate adjusted to ₦1,578.25 - 0.32% decrease',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'ALERT-003',
    severity: 'info' as const,
    title: 'Crypto Rail Savings',
    message: 'This week: ₦2.4M saved vs traditional bank transfers',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default async function DashboardPage() {
  return (
    <DashboardPageWrapper
      transactions={transactions}
      alerts={mockAlerts}
    />
  );
}
