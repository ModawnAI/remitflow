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
} from '@phosphor-icons/react';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

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

export function UserTable({ users, onSuspend, onUnsuspend }: UserTableProps) {
  const router = useRouter();

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
        onRowClick={(row) => router.push(`/users/${row.id}`)}
      />
    </motion.div>
  );
}
