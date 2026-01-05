import type { Metadata } from 'next';
import { DashboardPageWrapper } from '@/components/wrappers/dashboard-page-wrapper';

export const metadata: Metadata = {
  title: 'Dashboard | RemitFlow Admin',
  description: 'Transaction monitoring and operations dashboard',
};

const mockMetrics = [
  { id: '1', title: 'Volume (24h)', value: '£125,430', change: 12.5, trend: 'up' as const, icon: 'CurrencyGbp' },
  { id: '2', title: 'Transactions (24h)', value: '342', change: 8.2, trend: 'up' as const, icon: 'ArrowsLeftRight' },
  { id: '3', title: 'Success Rate', value: '98.5%', change: 0.3, trend: 'up' as const, icon: 'CheckCircle' },
  { id: '4', title: 'Pending', value: '12', change: -2, trend: 'down' as const, icon: 'Clock' },
];

const mockTransactions = [
  {
    id: 'TXN-001',
    reference: 'REF-001',
    status: 'completed' as const,
    sendAmount: 500,
    sendCurrency: 'GBP',
    receiveAmount: 825000,
    receiveCurrency: 'NGN',
    exchangeRate: 1650,
    fee: 4.99,
    senderId: 'user-001',
    senderName: 'John Smith',
    senderPhone: '+44 7700 900000',
    recipientId: 'rcpt-001',
    recipientName: 'Adebayo Okonkwo',
    recipientBank: 'GTBank',
    recipientAccount: '****5678',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'TXN-002',
    reference: 'REF-002',
    status: 'processing' as const,
    sendAmount: 250,
    sendCurrency: 'GBP',
    receiveAmount: 412500,
    receiveCurrency: 'NGN',
    exchangeRate: 1650,
    fee: 3.99,
    senderId: 'user-002',
    senderName: 'Sarah Johnson',
    senderPhone: '+44 7700 900001',
    recipientId: 'rcpt-002',
    recipientName: 'Chioma Eze',
    recipientBank: 'First Bank',
    recipientAccount: '****1234',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'TXN-003',
    reference: 'REF-003',
    status: 'pending' as const,
    sendAmount: 1000,
    sendCurrency: 'GBP',
    receiveAmount: 1650000,
    receiveCurrency: 'NGN',
    exchangeRate: 1650,
    fee: 7.99,
    senderId: 'user-003',
    senderName: 'Michael Brown',
    senderPhone: '+44 7700 900002',
    recipientId: 'rcpt-003',
    recipientName: 'Emeka Nwosu',
    recipientBank: 'Zenith Bank',
    recipientAccount: '****9012',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockAlerts = [
  {
    id: 'ALERT-001',
    severity: 'warning' as const,
    title: 'High Transaction Volume',
    message: 'Transaction volume is 25% higher than average for this time period',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ALERT-002',
    severity: 'error' as const,
    title: 'Payment Gateway Issue',
    message: 'Open Banking connection experiencing intermittent failures',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default async function DashboardPage() {
  return (
    <DashboardPageWrapper
      metrics={mockMetrics}
      transactions={mockTransactions}
      alerts={mockAlerts}
    />
  );
}
