'use client';

import { useRouter } from 'next/navigation';
import { Eye, CheckCircle, XCircle, DotsThree, Clock, Warning, CaretRight } from '@phosphor-icons/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DataTable, Avatar, type ColumnDef } from '@/components/ui';
import type { KYCApplication, KYCStatus } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';

export interface KYCReviewTableProps {
  applications: KYCApplication[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  onReview?: (userId: string) => void;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
  className?: string;
}

const kycStatusMap: Record<KYCStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  approved: { label: 'Approved', color: 'text-green-600', bgColor: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100' },
  expired: { label: 'Expired', color: 'text-neutral-600', bgColor: 'bg-neutral-100' },
};

function getPriorityIndicator(application: KYCApplication) {
  const waitingHours = (Date.now() - new Date(application.submittedAt).getTime()) / (1000 * 60 * 60);

  if (waitingHours > 24) {
    return { icon: Warning, color: 'text-error', label: 'Overdue', bgColor: 'bg-red-100' };
  }
  if (waitingHours > 12) {
    return { icon: Clock, color: 'text-warning', label: 'Urgent', bgColor: 'bg-amber-100' };
  }
  return null;
}

/** Mobile card component for KYC application display */
function KYCMobileCard({
  application,
  onRowClick
}: {
  application: KYCApplication;
  onRowClick?: (application: KYCApplication) => void;
}) {
  const priority = getPriorityIndicator(application);
  const status = kycStatusMap[application.status];

  return (
    <div
      onClick={() => onRowClick?.(application)}
      className={cn(
        'rounded-lg border border-border bg-card p-4 transition-colors',
        onRowClick && 'cursor-pointer active:bg-muted/50'
      )}
    >
      {/* Header: Priority + User info + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {priority && (
            <div className={cn('p-1.5 rounded-full', priority.bgColor)} title={priority.label}>
              <priority.icon size={14} className={priority.color} weight="fill" />
            </div>
          )}
          <Avatar name={application.userName || application.userPhone} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {application.userName || 'Unknown'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {application.userPhone}
            </p>
          </div>
        </div>
        <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0', status.bgColor, status.color)}>
          {status.label}
        </span>
      </div>

      {/* Tier + Documents + Biometric row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-muted/50 text-center">
          <span className="inline-flex rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-medium capitalize text-secondary-700">
            {application.tier}
          </span>
          <p className="text-xs text-muted-foreground mt-1">Tier</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50 text-center">
          <p className="text-sm font-medium text-foreground">{application.documents.length}</p>
          <p className="text-xs text-muted-foreground">
            {application.documents.filter(d => d.status === 'approved').length} verified
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50 text-center">
          {application.biometricResult ? (
            <>
              <div className="flex items-center justify-center gap-1">
                {application.biometricResult.passed ? (
                  <CheckCircle size={14} className="text-success" weight="fill" />
                ) : (
                  <XCircle size={14} className="text-error" weight="fill" />
                )}
                <span className="text-sm font-medium">
                  {application.biometricResult.matchScore}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Biometric</p>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">Not done</p>
              <p className="text-xs text-muted-foreground">Biometric</p>
            </>
          )}
        </div>
      </div>

      {/* Footer: Submitted time */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
        <span className="text-muted-foreground">
          Submitted {formatRelativeTime(application.submittedAt)}
        </span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span>Tap to review</span>
          <CaretRight size={12} />
        </div>
      </div>
    </div>
  );
}

export function KYCReviewTable({
  applications,
  pagination,
  onReview,
  onApprove,
  onReject,
  className,
}: KYCReviewTableProps) {
  const router = useRouter();

  const handleRowClick = (application: KYCApplication) => {
    if (onReview) {
      onReview(application.userId);
    } else {
      router.push(`/kyc/${application.userId}`);
    }
  };

  const columns: ColumnDef<KYCApplication>[] = [
    {
      id: 'priority',
      header: '',
      cell: (row) => {
        const priority = getPriorityIndicator(row);
        if (!priority) return null;
        return (
          <div className="flex items-center" title={priority.label}>
            <priority.icon size={16} className={priority.color} weight="fill" />
          </div>
        );
      },
      className: 'w-8',
    },
    {
      id: 'user',
      header: 'Applicant',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.userName || row.userPhone} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-900">
              {row.userName || 'Unknown'}
            </span>
            <span className="text-xs text-neutral-500">{row.userPhone}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'tier',
      header: 'Tier',
      cell: (row) => (
        <span className="inline-flex rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-medium capitalize text-secondary-700">
          {row.tier}
        </span>
      ),
    },
    {
      id: 'documents',
      header: 'Documents',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-neutral-900">
            {row.documents.length} uploaded
          </span>
          <span className="text-xs text-neutral-500">
            {row.documents.filter(d => d.status === 'approved').length} verified
          </span>
        </div>
      ),
    },
    {
      id: 'biometric',
      header: 'Biometric',
      cell: (row) => {
        if (!row.biometricResult) {
          return <span className="text-xs text-neutral-400">Not completed</span>;
        }
        return (
          <div className="flex items-center gap-1">
            {row.biometricResult.passed ? (
              <CheckCircle size={16} className="text-success" weight="fill" />
            ) : (
              <XCircle size={16} className="text-error" weight="fill" />
            )}
            <span className="text-xs text-neutral-600">
              {row.biometricResult.matchScore}% match
            </span>
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => {
        const status = kycStatusMap[row.status];
        return (
          <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', status.bgColor, status.color)}>
            {status.label}
          </span>
        );
      },
    },
    {
      id: 'submitted',
      header: 'Submitted',
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-neutral-500">
          {formatRelativeTime(row.submittedAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (row) => (
        <KYCActions
          application={row}
          onReview={onReview}
          onApprove={onApprove}
          onReject={onReject}
        />
      ),
      className: 'w-10',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={applications}
      pagination={pagination}
      onRowClick={handleRowClick}
      emptyMessage="No pending KYC applications"
      className={className}
      mobileCardRender={(row, onClick) => (
        <KYCMobileCard application={row} onRowClick={onClick} />
      )}
    />
  );
}

interface KYCActionsProps {
  application: KYCApplication;
  onReview?: (userId: string) => void;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
}

function KYCActions({ application, onReview, onApprove, onReject }: KYCActionsProps) {
  const router = useRouter();
  const isPending = application.status === 'pending';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="KYC actions"
        >
          <DotsThree size={20} weight="bold" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[160px] rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"
          align="end"
          sideOffset={4}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 outline-none hover:bg-neutral-100 focus:bg-neutral-100"
            onClick={() =>
              onReview
                ? onReview(application.userId)
                : router.push(`/kyc/${application.userId}`)
            }
          >
            <Eye size={16} />
            Review Application
          </DropdownMenu.Item>

          {isPending && (
            <>
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-success outline-none hover:bg-success/10 focus:bg-success/10"
                onClick={() => onApprove?.(application.userId)}
              >
                <CheckCircle size={16} />
                Quick Approve
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-error outline-none hover:bg-error/10 focus:bg-error/10"
                onClick={() => onReject?.(application.userId)}
              >
                <XCircle size={16} />
                Reject
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
