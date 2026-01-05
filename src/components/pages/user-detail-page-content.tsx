'use client';

import type { Route } from 'next';
import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { UserProfileCard } from '@/components/features/user-profile-card';
import { TransactionTable } from '@/components/features/transaction-table';
import { RecipientsList } from '@/components/features/recipients-list';

interface Transaction {
  id: string;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
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

interface UserDetailPageContentProps {
  user: User;
  transactions: Transaction[];
  recipients: Recipient[];
}

export function UserDetailPageContent({ user, transactions, recipients }: UserDetailPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={user.name}
          description="User profile and activity"
          backLink={'/users' as Route}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UserProfileCard user={user} />

            <div className="bg-white rounded-xl border border-neutral-200">
              <div className="p-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Recent Transactions
                </h2>
              </div>
              <TransactionTable transactions={transactions} />
            </div>
          </div>

          <div>
            <RecipientsList recipients={recipients} />
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
