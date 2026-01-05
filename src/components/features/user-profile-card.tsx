'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  Envelope,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
  CurrencyGbp,
  ArrowsLeftRight,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';

type UserKYCStatus = 'verified' | 'pending' | 'rejected';
type UserAccountStatus = 'active' | 'suspended' | 'blocked';

interface ProfileUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycStatus: UserKYCStatus;
  kycTier: number;
  transactionCount: number;
  totalVolume: number;
  lastActiveAt: string;
  registeredAt: string;
  status: UserAccountStatus;
  limits: {
    daily: number;
    monthly: number;
    singleTransaction: number;
  };
}

interface UserProfileCardProps {
  user: ProfileUser;
  onSuspend?: () => void;
  onUnsuspend?: () => void;
}

export function UserProfileCard({ user, onSuspend, onUnsuspend }: UserProfileCardProps) {
  const kycStatusConfig: Record<UserKYCStatus, { icon: React.ElementType; color: string; bg: string }> = {
    verified: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  };

  const statusConfig = kycStatusConfig[user.kycStatus];
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <Avatar name={user.name} size="lg" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-neutral-900">{user.name}</h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Phone size={16} />
                    {user.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Envelope size={16} />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Calendar size={16} />
                    Joined {formatDate(user.registeredAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <StatusBadge
                status={user.status === 'active' ? 'completed' : user.status === 'suspended' ? 'failed' : 'failed'}
              />
              {user.status === 'active' ? (
                <Button variant="outline" size="sm" onClick={onSuspend}>
                  Suspend Account
                </Button>
              ) : (user.status === 'suspended' || user.status === 'blocked') ? (
                <Button variant="primary" size="sm" onClick={onUnsuspend}>
                  Reactivate Account
                </Button>
              ) : null}
            </div>
          </div>

          {/* KYC Status */}
          <div className={`p-4 rounded-xl ${statusConfig.bg} min-w-[200px]`}>
            <div className="flex items-center gap-2 mb-3">
              <StatusIcon size={24} className={statusConfig.color} weight="fill" />
              <span className="font-medium text-neutral-900 capitalize">
                {user.kycStatus.replace('_', ' ')}
              </span>
            </div>
            {user.kycTier > 0 && (
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary-600" />
                <span className="text-sm text-neutral-700">Tier {user.kycTier}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats & Limits */}
        <div className="mt-6 pt-6 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
              <ArrowsLeftRight size={16} />
              Transactions
            </div>
            <p className="text-xl font-semibold text-neutral-900">{user.transactionCount}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
              <CurrencyGbp size={16} />
              Total Volume
            </div>
            <p className="text-xl font-semibold text-neutral-900">
              {formatCurrency(user.totalVolume, 'GBP')}
            </p>
          </div>
          <div>
            <div className="text-neutral-500 text-sm mb-1">Daily Limit</div>
            <p className="text-xl font-semibold text-neutral-900">
              {formatCurrency(user.limits.daily, 'GBP')}
            </p>
          </div>
          <div>
            <div className="text-neutral-500 text-sm mb-1">Monthly Limit</div>
            <p className="text-xl font-semibold text-neutral-900">
              {formatCurrency(user.limits.monthly, 'GBP')}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
