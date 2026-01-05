'use client';

import {
  Phone,
  Envelope,
  Calendar,
  ShieldCheck,
  Warning,
  CheckCircle,
  XCircle,
  Clock,
} from '@phosphor-icons/react';
import { Avatar } from '@/components/ui';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';

type KYCStatus = 'pending' | 'approved' | 'rejected' | 'expired';
type KYCTier = 'basic' | 'standard' | 'enhanced';

interface User {
  name?: string;
  phone: string;
  email?: string;
  kycStatus: KYCStatus;
  kycTier: KYCTier;
  createdAt: string;
  lastActiveAt?: string;
  transactionLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface UserInfoCardProps {
  user: User;
  className?: string;
}

const kycStatusMap: Record<KYCStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: 'Pending Verification', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  approved: { label: 'Verified', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
  expired: { label: 'Verification Expired', color: 'text-neutral-600', bgColor: 'bg-neutral-100', icon: Warning },
};

const tierLimits: Record<KYCTier, { label: string; description: string; color: string }> = {
  basic: {
    label: 'Basic',
    description: 'Phone verified only',
    color: 'bg-neutral-100 text-neutral-700',
  },
  standard: {
    label: 'Standard',
    description: 'ID document verified',
    color: 'bg-primary-100 text-primary-700',
  },
  enhanced: {
    label: 'Enhanced',
    description: 'Full verification complete',
    color: 'bg-secondary-100 text-secondary-700',
  },
};

export function UserInfoCard({ user, className }: UserInfoCardProps) {
  const status = kycStatusMap[user.kycStatus];
  const tier = tierLimits[user.kycTier];
  const StatusIcon = status.icon;

  return (
    <div className={cn('rounded-xl border border-neutral-200 bg-white', className)}>
      {/* Header with Avatar */}
      <div className="flex items-start gap-4 border-b border-neutral-100 p-4">
        <Avatar name={user.name || user.phone} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-neutral-900">
              {user.name || 'Unknown User'}
            </h3>
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', tier.color)}>
              {tier.label}
            </span>
          </div>
          <div className={cn('mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', status.bgColor, status.color)}>
            <StatusIcon size={14} weight="fill" />
            {status.label}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Contact Information
        </h4>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Phone size={18} className="text-neutral-400" />
            <span className="text-neutral-900">{user.phone}</span>
          </div>

          {user.email && (
            <div className="flex items-center gap-3 text-sm">
              <Envelope size={18} className="text-neutral-400" />
              <span className="text-neutral-900">{user.email}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <Calendar size={18} className="text-neutral-400" />
            <div className="flex flex-col">
              <span className="text-neutral-900">
                Joined {formatRelativeTime(user.createdAt)}
              </span>
              {user.lastActiveAt && (
                <span className="text-xs text-neutral-500">
                  Last active {formatRelativeTime(user.lastActiveAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="space-y-3 border-t border-neutral-100 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Verification Status
        </h4>

        <div className="rounded-lg bg-neutral-50 p-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              user.kycStatus === 'approved' ? 'bg-success/10' : 'bg-warning/10'
            )}>
              {user.kycStatus === 'approved' ? (
                <ShieldCheck size={20} className="text-success" weight="fill" />
              ) : (
                <Warning size={20} className="text-warning" weight="fill" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">{tier.label} Tier</p>
              <p className="text-xs text-neutral-500">{tier.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Limits */}
      <div className="space-y-3 border-t border-neutral-100 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Transaction Limits
        </h4>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-neutral-50 p-3 text-center">
            <p className="text-xs text-neutral-500">Per Transaction</p>
            <p className="text-sm font-semibold text-neutral-900">
              {formatCurrency(user.transactionLimit, 'GBP')}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3 text-center">
            <p className="text-xs text-neutral-500">Daily</p>
            <p className="text-sm font-semibold text-neutral-900">
              {formatCurrency(user.dailyLimit, 'GBP')}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3 text-center">
            <p className="text-xs text-neutral-500">Monthly</p>
            <p className="text-sm font-semibold text-neutral-900">
              {formatCurrency(user.monthlyLimit, 'GBP')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
