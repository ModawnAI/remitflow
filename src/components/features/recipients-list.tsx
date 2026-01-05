'use client';

import { motion } from 'framer-motion';
import { Bank, User, DotsThree } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

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

interface RecipientsListProps {
  recipients: Recipient[];
  onViewRecipient?: (recipientId: string) => void;
}

export function RecipientsList({ recipients, onViewRecipient }: RecipientsListProps) {
  if (recipients.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <User size={32} className="text-neutral-400" />
        </div>
        <h3 className="font-medium text-neutral-900 mb-1">No Recipients</h3>
        <p className="text-sm text-neutral-500">
          This user hasn&apos;t added any recipients yet.
        </p>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-neutral-100">
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">Saved Recipients</h3>
        <span className="text-sm text-neutral-500">{recipients.length} recipients</span>
      </div>

      {recipients.map((recipient, index) => (
        <motion.div
          key={recipient.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="p-4 hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Bank size={24} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">{recipient.name}</p>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span>{recipient.bankName}</span>
                  <span className="text-neutral-300">•</span>
                  <span>****{recipient.accountNumber.slice(-4)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-neutral-900">
                  {formatCurrency(recipient.totalSent, 'NGN')}
                </p>
                <p className="text-sm text-neutral-500">
                  {recipient.transactionCount} transactions
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewRecipient?.(recipient.id)}
                aria-label="More actions"
              >
                <DotsThree size={20} weight="bold" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </Card>
  );
}
