'use client';

import { motion } from 'framer-motion';
import {
  User,
  Phone,
  EnvelopeSimple,
  Bank,
  CreditCard,
  HashStraight,
  ArrowsLeftRight,
  CurrencyGbp,
  Percent,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

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
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface TransactionDetailsProps {
  transaction: Transaction;
}

interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={18} />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground text-right">
        {value}
      </div>
    </div>
  );
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Sender Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Sender Details</h3>
        <div className="space-y-0">
          <DetailRow icon={User} label="Name" value={transaction.senderName} />
          <DetailRow icon={Phone} label="Phone" value={transaction.senderPhone} />
          <DetailRow icon={EnvelopeSimple} label="Email" value={transaction.senderEmail} />
        </div>
      </Card>

      {/* Recipient Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Recipient Details</h3>
        <div className="space-y-0">
          <DetailRow icon={User} label="Name" value={transaction.recipientName} />
          <DetailRow icon={Bank} label="Bank" value={transaction.recipientBank} />
          <DetailRow
            icon={HashStraight}
            label="Account Number"
            value={
              <span className="font-mono">
                {transaction.recipientAccount}
              </span>
            }
          />
        </div>
      </Card>

      {/* Payment Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Payment Details</h3>
        <div className="space-y-0">
          <DetailRow icon={CreditCard} label="Payment Method" value={transaction.paymentMethod} />
          <DetailRow
            icon={CurrencyGbp}
            label="Amount Sent"
            value={formatCurrency(transaction.amountGBP, 'GBP')}
          />
          <DetailRow
            icon={Percent}
            label="Service Fee"
            value={formatCurrency(transaction.fee, 'GBP')}
          />
          <DetailRow
            icon={CurrencyGbp}
            label="Total Charged"
            value={formatCurrency(transaction.amountGBP + transaction.fee, 'GBP')}
          />
        </div>
      </Card>

      {/* Settlement Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Settlement Details</h3>
        <div className="space-y-0">
          <DetailRow
            icon={ArrowsLeftRight}
            label="Exchange Rate"
            value={`₦${transaction.exchangeRate.toLocaleString()} / £1`}
          />
          <DetailRow
            icon={Bank}
            label="Amount Received"
            value={
              <span className="text-success font-semibold">
                ₦{transaction.amountNGN.toLocaleString()}
              </span>
            }
          />
          <DetailRow
            icon={HashStraight}
            label="Transaction ID"
            value={
              <span className="font-mono text-xs">
                {transaction.id}
              </span>
            }
          />
        </div>
      </Card>
    </motion.div>
  );
}
