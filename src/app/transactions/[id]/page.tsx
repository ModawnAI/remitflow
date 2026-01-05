import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TransactionDetailPageWrapper } from '@/components/wrappers/transaction-detail-page-wrapper';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Transaction ${id} | RemitFlow Admin`,
    description: 'Transaction details and audit trail',
  };
}

async function getTransaction(id: string) {
  const mockTransaction = {
    id,
    senderName: 'John Smith',
    senderPhone: '+44 7700 900000',
    senderEmail: 'john.smith@email.com',
    recipientName: 'Adebayo Okonkwo',
    recipientBank: 'GTBank',
    recipientAccount: '0123456789',
    amountGBP: 500,
    amountNGN: 825000,
    exchangeRate: 1650,
    fee: 4.99,
    status: 'completed' as const,
    paymentMethod: 'Apple Pay',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date().toISOString(),
    events: [
      {
        id: 'evt-1',
        transactionId: id,
        type: 'initiated',
        status: 'success' as const,
        description: 'Transaction initiated via WhatsApp',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'evt-2',
        transactionId: id,
        type: 'payment_received',
        status: 'success' as const,
        description: 'Apple Pay payment confirmed',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 'evt-3',
        transactionId: id,
        type: 'compliance_check',
        status: 'success' as const,
        description: 'Compliance checks passed',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: 'evt-4',
        transactionId: id,
        type: 'settlement_started',
        status: 'success' as const,
        description: 'Funds sent to liquidity provider in Nigeria',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'evt-5',
        transactionId: id,
        type: 'completed',
        status: 'success' as const,
        description: 'NGN credited to recipient account',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  if (!id.startsWith('TXN-')) {
    return null;
  }

  return mockTransaction;
}

export default async function TransactionDetailPage({ params }: Props) {
  const { id } = await params;
  const transaction = await getTransaction(id);

  if (!transaction) {
    notFound();
  }

  return <TransactionDetailPageWrapper transaction={transaction} />;
}
