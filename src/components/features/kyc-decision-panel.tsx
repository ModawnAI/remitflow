'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  PaperPlaneTilt,
  Warning,
  CaretDown,
} from '@phosphor-icons/react';
import * as Select from '@radix-ui/react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface KYCDecisionPanelProps {
  userId: string;
  userName?: string;
  hasWarnings?: boolean;
  warningMessages?: string[];
  onApprove: (userId: string, notes: string) => void;
  onReject: (userId: string, reason: string, notes: string) => void;
  onRequestAdditional: (userId: string, documentType: string, message: string) => void;
  isLoading?: boolean;
  className?: string;
}

const rejectionReasons = [
  { value: 'document_unreadable', label: 'Document is unreadable or blurry' },
  { value: 'document_expired', label: 'Document has expired' },
  { value: 'document_mismatch', label: 'Name does not match provided information' },
  { value: 'biometric_failed', label: 'Biometric verification failed' },
  { value: 'suspicious_document', label: 'Document appears altered or fraudulent' },
  { value: 'aml_concern', label: 'AML/Sanctions screening concern' },
  { value: 'pep_match', label: 'PEP match requires enhanced due diligence' },
  { value: 'other', label: 'Other (specify in notes)' },
];

const additionalDocumentTypes = [
  { value: 'proof_of_address', label: 'Proof of Address' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'utility_bill', label: 'Utility Bill' },
  { value: 'selfie_retake', label: 'New Selfie Photo' },
  { value: 'id_retake', label: 'New ID Document Photo' },
  { value: 'source_of_funds', label: 'Source of Funds Declaration' },
];

type DecisionType = 'approve' | 'reject' | 'request_additional' | null;

export function KYCDecisionPanel({
  userId,
  userName,
  hasWarnings = false,
  warningMessages = [],
  onApprove,
  onReject,
  onRequestAdditional,
  isLoading = false,
  className,
}: KYCDecisionPanelProps) {
  const [selectedDecision, setSelectedDecision] = useState<DecisionType>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [additionalDocType, setAdditionalDocType] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!selectedDecision) return;

    switch (selectedDecision) {
      case 'approve':
        onApprove(userId, notes);
        break;
      case 'reject':
        if (rejectionReason) {
          onReject(userId, rejectionReason, notes);
        }
        break;
      case 'request_additional':
        if (additionalDocType) {
          onRequestAdditional(userId, additionalDocType, notes);
        }
        break;
    }
  };

  const isSubmitDisabled =
    !selectedDecision ||
    (selectedDecision === 'reject' && !rejectionReason) ||
    (selectedDecision === 'request_additional' && !additionalDocType) ||
    isLoading;

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-medium text-foreground">KYC Decision</h3>
        {userName && (
          <p className="text-sm text-muted-foreground">
            Make a decision for {userName}&apos;s KYC application
          </p>
        )}
      </div>

      {/* Warnings */}
      {hasWarnings && warningMessages.length > 0 && (
        <div className="mx-4 mt-4 rounded-lg bg-warning/10 p-3">
          <div className="flex items-center gap-2 text-warning">
            <Warning size={20} weight="fill" />
            <span className="text-sm font-medium">Review Warnings</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-foreground">
            {warningMessages.map((message, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-warning">•</span>
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Decision Buttons */}
      <div className="p-4">
        <p className="mb-3 text-sm font-medium text-foreground">Select Decision</p>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedDecision('approve')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
              selectedDecision === 'approve'
                ? 'border-success bg-success/5'
                : 'border-border hover:border-muted-foreground'
            )}
          >
            <CheckCircle
              size={32}
              weight={selectedDecision === 'approve' ? 'fill' : 'regular'}
              className={selectedDecision === 'approve' ? 'text-success' : 'text-muted-foreground'}
            />
            <span className={cn(
              'text-sm font-medium',
              selectedDecision === 'approve' ? 'text-success' : 'text-muted-foreground'
            )}>
              Approve
            </span>
          </button>

          <button
            onClick={() => setSelectedDecision('reject')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
              selectedDecision === 'reject'
                ? 'border-error bg-error/5'
                : 'border-border hover:border-muted-foreground'
            )}
          >
            <XCircle
              size={32}
              weight={selectedDecision === 'reject' ? 'fill' : 'regular'}
              className={selectedDecision === 'reject' ? 'text-error' : 'text-muted-foreground'}
            />
            <span className={cn(
              'text-sm font-medium',
              selectedDecision === 'reject' ? 'text-error' : 'text-muted-foreground'
            )}>
              Reject
            </span>
          </button>

          <button
            onClick={() => setSelectedDecision('request_additional')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
              selectedDecision === 'request_additional'
                ? 'border-info bg-info/5'
                : 'border-border hover:border-muted-foreground'
            )}
          >
            <PaperPlaneTilt
              size={32}
              weight={selectedDecision === 'request_additional' ? 'fill' : 'regular'}
              className={selectedDecision === 'request_additional' ? 'text-info' : 'text-muted-foreground'}
            />
            <span className={cn(
              'text-sm font-medium',
              selectedDecision === 'request_additional' ? 'text-info' : 'text-muted-foreground'
            )}>
              Request More
            </span>
          </button>
        </div>

        {/* Additional Fields */}
        <AnimatePresence mode="wait">
          {selectedDecision === 'reject' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Rejection Reason *
                </label>
                <Select.Root value={rejectionReason} onValueChange={setRejectionReason}>
                  <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                    <Select.Value placeholder="Select a reason..." />
                    <Select.Icon>
                      <CaretDown size={16} className="text-muted-foreground" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="z-50 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                      <Select.Viewport className="p-1">
                        {rejectionReasons.map((reason) => (
                          <Select.Item
                            key={reason.value}
                            value={reason.value}
                            className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm outline-none hover:bg-muted focus:bg-muted"
                          >
                            <Select.ItemText>{reason.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </motion.div>
          )}

          {selectedDecision === 'request_additional' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Document Type to Request *
                </label>
                <Select.Root value={additionalDocType} onValueChange={setAdditionalDocType}>
                  <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                    <Select.Value placeholder="Select document type..." />
                    <Select.Icon>
                      <CaretDown size={16} className="text-muted-foreground" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="z-50 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                      <Select.Viewport className="p-1">
                        {additionalDocumentTypes.map((docType) => (
                          <Select.Item
                            key={docType.value}
                            value={docType.value}
                            className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm outline-none hover:bg-muted focus:bg-muted"
                          >
                            <Select.ItemText>{docType.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes */}
        {selectedDecision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Notes {selectedDecision === 'reject' && rejectionReason === 'other' && '*'}
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                selectedDecision === 'approve'
                  ? 'Add any notes for the approval...'
                  : selectedDecision === 'reject'
                  ? 'Explain the rejection reason in detail...'
                  : 'Add a message to the user about what documents are needed...'
              }
              rows={3}
            />
          </motion.div>
        )}

        {/* Submit Button */}
        {selectedDecision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              loading={isLoading}
              variant={
                selectedDecision === 'approve'
                  ? 'primary'
                  : selectedDecision === 'reject'
                  ? 'destructive'
                  : 'secondary'
              }
              className="w-full"
            >
              {selectedDecision === 'approve' && 'Approve Application'}
              {selectedDecision === 'reject' && 'Reject Application'}
              {selectedDecision === 'request_additional' && 'Send Request'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
