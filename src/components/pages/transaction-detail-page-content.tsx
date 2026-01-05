'use client';

import type { Route } from 'next';
import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { TransactionHeader } from '@/components/features/transaction-header';
import { TransactionTimeline } from '@/components/features/transaction-timeline';
import { TransactionDetails } from '@/components/features/transaction-details';
import { TransactionActions } from '@/components/features/transaction-actions';
import type { TransactionStatus, TransactionEvent } from '@/types';

interface DetailTransaction {
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
  status: TransactionStatus;
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
  events: TransactionEvent[];
}

interface TransactionDetailPageContentProps {
  transaction: DetailTransaction;
}

export function TransactionDetailPageContent({ transaction }: TransactionDetailPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Transaction ${transaction.id}`}
          description="Transaction details and audit trail"
          backLink={'/transactions' as Route}
        />

        <TransactionHeader transaction={transaction} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Transaction Timeline
              </h2>
              <TransactionTimeline events={transaction.events} />
            </div>

            <TransactionDetails transaction={transaction} />
          </div>

          <div>
            <TransactionActions
              transaction={transaction}
              onRetry={async () => { /* TODO: Implement server action */ }}
              onRefund={async () => { /* TODO: Implement server action */ }}
              onEscalate={async () => { /* TODO: Implement server action */ }}
            />
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
