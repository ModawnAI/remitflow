'use client';

import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { TransactionFilters } from '@/components/features/transaction-filters';
import { TransactionTable } from '@/components/features/transaction-table';
import { PageHeader } from '@/components/layouts/page-header';

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
  failureReason?: string;
}

interface TransactionsPageContentProps {
  transactions: Transaction[];
}

export function TransactionsPageContent({ transactions }: TransactionsPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Transactions"
          description="View and manage all remittance transactions"
        />

        <TransactionFilters />

        <div className="bg-card rounded-xl border border-border">
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
