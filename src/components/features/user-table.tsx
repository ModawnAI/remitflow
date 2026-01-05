'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Eye,
  UserMinus,
  UserCheck,
  DotsThree,
  CheckCircle,
  Clock,
  XCircle,
  Warning,
  CaretRight,
} from '@phosphor-icons/react';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatRelativeTime, cn } from '@/lib/utils';

type UserKYCStatus = 'verified' | 'pending' | 'rejected';
type UserAccountStatus = 'active' | 'suspended' | 'blocked';

interface User {
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
}

interface UserTableProps {
  users: User[];
  onSuspend?: (userId: string) => void;
  onUnsuspend?: (userId: string) => void;
}

function getKYCStatusIcon(status: UserKYCStatus) {
  switch (status) {
    case 'verified':
      return CheckCircle;
    case 'pending':
      return Clock;
    case 'rejected':
      return XCircle;
  }
}

function getKYCStatusColor(status: UserKYCStatus) {
  switch (status) {
    case 'verified':
      return 'text-green-600';
    case 'pending':
      return 'text-amber-600';
    case 'rejected':
      return 'text-red-600';
  }
}

function getKYCBgColor(status: UserKYCStatus) {
  switch (status) {
    case 'verified':
      return 'bg-green-100';
    case 'pending':
      return 'bg-amber-100';
    case 'rejected':
      return 'bg-red-100';
  }
}

/** Mobile card component for user display */
function UserMobileCard({
  user,
  onRowClick
}: {
  user: User;
  onRowClick?: (user: User) => void;
}) {
  const Icon = getKYCStatusIcon(user.kycStatus);
  const colorClass = getKYCStatusColor(user.kycStatus);
  const bgClass = getKYCBgColor(user.kycStatus);

  return (
    <div
      onClick={() => onRowClick?.(user)}
      className={cn(
        'rounded-lg border border-border bg-card p-4 transition-colors',
        onRowClick && 'cursor-pointer active:bg-muted/50'
      )}
    >
      {/* Header: User info + Account Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.phone}
            </p>
          </div>
        </div>
        <StatusBadge
          status={user.status === 'active' ? 'completed' : 'failed'}
          size="sm"
        />
      </div>

      {/* KYC Status + Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className={cn('p-3 rounded-lg', bgClass)}>
          <div className="flex items-center gap-1.5 mb-1">
            <Icon size={14} className={colorClass} weight="fill" />
            <span className="text-xs font-medium capitalize">{user.kycStatus}</span>
          </div>
          {user.kycTier > 0 && (
            <span className="text-xs text-muted-foreground">Tier {user.kycTier}</span>
          )}
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm font-semibold text-foreground">{user.transactionCount}</p>
          <p className="text-xs text-muted-foreground">Transactions</p>
        </div>
      </div>

      {/* Footer: Volume + Last Active */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
        <div>
          <span className="text-muted-foreground">Volume: </span>
          <span className="font-medium text-foreground">{formatCurrency(user.totalVolume, 'GBP')}</span>
        </div>
        <div className="text-muted-foreground">
          Active {formatRelativeTime(user.lastActiveAt)}
        </div>
      </div>

      {/* Tap to view indicator */}
      <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
        <span>Tap to view details</span>
        <CaretRight size={12} />
      </div>
    </div>
  );
}

export function UserTable({ users, onSuspend, onUnsuspend }: UserTableProps) {
  const router = useRouter();

  const handleRowClick = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'name',
      header: 'User',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-sm text-muted-foreground">{row.phone}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'kycStatus',
      header: 'KYC Status',
      accessorKey: 'kycStatus',
      cell: (row) => {
        const Icon = getKYCStatusIcon(row.kycStatus);
        const colorClass = getKYCStatusColor(row.kycStatus);
        return (
          <div className="flex items-center gap-2">
            <Icon size={18} className={colorClass} weight="fill" />
            <span className="capitalize text-sm">{row.kycStatus.replace('_', ' ')}</span>
            {row.kycTier > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded">
                Tier {row.kycTier}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'transactionCount',
      header: 'Transactions',
      accessorKey: 'transactionCount',
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.transactionCount}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(row.totalVolume, 'GBP')} total
          </p>
        </div>
      ),
    },
    {
      id: 'lastActiveAt',
      header: 'Last Active',
      accessorKey: 'lastActiveAt',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(row.lastActiveAt)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <StatusBadge
          status={row.status === 'active' ? 'completed' : row.status === 'suspended' ? 'failed' : 'failed'}
          size="sm"
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/users/${row.id}`)}
            aria-label="View user"
          >
            <Eye size={18} />
          </Button>
          {row.status === 'active' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSuspend?.(row.id)}
              aria-label="Suspend user"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <UserMinus size={18} />
            </Button>
          ) : (row.status === 'suspended' || row.status === 'blocked') ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUnsuspend?.(row.id)}
              aria-label="Unsuspend user"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <UserCheck size={18} />
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" aria-label="More actions">
            <DotsThree size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DataTable
        columns={columns}
        data={users}
        onRowClick={handleRowClick}
        mobileCardRender={(row, onClick) => (
          <UserMobileCard user={row} onRowClick={onClick} />
        )}
      />
    </motion.div>
  );
}
