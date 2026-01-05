'use client';

import dynamic from 'next/dynamic';

const TransactionsPageContent = dynamic(
  () => import('@/components/pages/transactions-page-content').then((mod) => mod.TransactionsPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-40 bg-muted rounded" />
            <div className="h-16 bg-muted rounded-xl" />
            <div className="h-96 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    ),
  }
);

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
  failureReason?: string;
}

interface TransactionsPageWrapperProps {
  transactions: Transaction[];
}

export function TransactionsPageWrapper({ transactions }: TransactionsPageWrapperProps) {
  return <TransactionsPageContent transactions={transactions} />;
}
