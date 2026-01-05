'use client';

import dynamic from 'next/dynamic';

const UserDetailPageContent = dynamic(
  () => import('@/components/pages/user-detail-page-content').then((mod) => mod.UserDetailPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-muted rounded-xl" />
                <div className="h-64 bg-muted rounded-xl" />
              </div>
              <div className="h-80 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

interface Recipient {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  country: string;
  transactionCount: number;
  totalSent: number;
  lastUsed: string;
}

interface Transaction {
  id: string;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  senderId: string;
  senderName: string;
  senderPhone: string;
  recipientId: string;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycTier: number;
  transactionCount: number;
  totalVolume: number;
  lastActiveAt: string;
  registeredAt: string;
  status: 'active' | 'suspended' | 'blocked';
  limits: {
    daily: number;
    monthly: number;
    singleTransaction: number;
  };
}

interface UserDetailPageWrapperProps {
  user: User;
  recipients: Recipient[];
  transactions: Transaction[];
}

export function UserDetailPageWrapper({ user, recipients, transactions }: UserDetailPageWrapperProps) {
  return <UserDetailPageContent user={user} recipients={recipients} transactions={transactions} />;
}
