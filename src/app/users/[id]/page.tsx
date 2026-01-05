import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserDetailPageWrapper } from '@/components/wrappers/user-detail-page-wrapper';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `User ${id} | RemitFlow Admin`,
    description: 'User profile and transaction history',
  };
}

async function getUser(id: string) {
  const mockUser = {
    id,
    name: 'James Okafor',
    phone: '+44 7700 900010',
    email: 'james.okafor@email.com',
    kycStatus: 'verified' as const,
    kycTier: 2,
    transactionCount: 15,
    totalVolume: 7500,
    lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
    registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    status: 'active' as const,
    limits: {
      daily: 5000,
      monthly: 25000,
      singleTransaction: 2000,
    },
  };

  if (!id.startsWith('usr-')) {
    return null;
  }

  return mockUser;
}

const mockUserTransactions = [
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
    senderId: 'usr-001',
    senderName: 'James Okafor',
    senderPhone: '+44 7700 900010',
    recipientId: 'rec-001',
    recipientName: 'Adebayo Okonkwo',
    recipientBank: 'GTBank',
    recipientAccount: '****5678',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'TXN-006',
    reference: 'REF-006',
    status: 'completed' as const,
    sendAmount: 300,
    sendCurrency: 'GBP',
    receiveAmount: 495000,
    receiveCurrency: 'NGN',
    exchangeRate: 1650,
    fee: 3.99,
    senderId: 'usr-001',
    senderName: 'James Okafor',
    senderPhone: '+44 7700 900010',
    recipientId: 'rec-002',
    recipientName: 'Chidi Eze',
    recipientBank: 'First Bank',
    recipientAccount: '****1234',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const mockRecipients = [
  {
    id: 'rec-001',
    name: 'Adebayo Okonkwo',
    bankName: 'GTBank',
    accountNumber: '****5678',
    country: 'Nigeria',
    transactionCount: 8,
    totalSent: 4125000,
    lastUsed: new Date().toISOString(),
  },
  {
    id: 'rec-002',
    name: 'Chidi Eze',
    bankName: 'First Bank',
    accountNumber: '****1234',
    country: 'Nigeria',
    transactionCount: 4,
    totalSent: 1980000,
    lastUsed: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rec-003',
    name: 'Ngozi Okoro',
    bankName: 'UBA',
    accountNumber: '****7890',
    country: 'Nigeria',
    transactionCount: 3,
    totalSent: 1485000,
    lastUsed: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <UserDetailPageWrapper
      user={user}
      transactions={mockUserTransactions}
      recipients={mockRecipients}
    />
  );
}
