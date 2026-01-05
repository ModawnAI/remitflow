'use client';

import dynamic from 'next/dynamic';

const TransactionDetailPageContent = dynamic(
  () => import('@/components/pages/transaction-detail-page-content').then((mod) => mod.TransactionDetailPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-24 bg-muted rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-60 bg-muted rounded-xl" />
                <div className="h-40 bg-muted rounded-xl" />
              </div>
              <div className="h-40 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

interface TransactionEvent {
  id: string;
  transactionId: string;
  type: string;
  status: 'success' | 'pending' | 'failed';
  description: string;
  timestamp: string;
}

interface Transaction {
  id: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  amountGBP: number;
  amountNGN: number;
  exchangeRate: number;
  fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
  events: TransactionEvent[];
}

interface TransactionDetailPageWrapperProps {
  transaction: Transaction;
}

export function TransactionDetailPageWrapper({ transaction }: TransactionDetailPageWrapperProps) {
  return <TransactionDetailPageContent transaction={transaction} />;
}
