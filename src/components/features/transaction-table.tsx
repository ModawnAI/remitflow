'use client';

import { useRouter } from 'next/navigation';
import { Eye, ArrowClockwise, ArrowUUpLeft, DotsThree, CaretRight } from '@phosphor-icons/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DataTable, StatusBadge, AmountDisplay, Avatar, type ColumnDef } from '@/components/ui';
import type { Transaction } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';

export interface TransactionTableProps {
  transactions: Transaction[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  onView?: (id: string) => void;
  onRetry?: (id: string) => void;
  onRefund?: (id: string) => void;
  className?: string;
}

/** Mobile card component for transaction display */
function TransactionMobileCard({
  transaction,
  onRowClick
}: {
  transaction: Transaction;
  onRowClick?: (transaction: Transaction) => void;
}) {
  return (
    <div
      onClick={() => onRowClick?.(transaction)}
      className={cn(
        'rounded-lg border border-border bg-card p-4 transition-colors',
        onRowClick && 'cursor-pointer active:bg-muted/50'
      )}
    >
      {/* Header: Sender + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar name={transaction.senderName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {transaction.senderName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {transaction.senderPhone}
            </p>
          </div>
        </div>
        <StatusBadge status={transaction.status} size="sm" />
      </div>

      {/* Amount Section */}
      <div className="flex items-center justify-between mb-3 p-3 rounded-lg bg-muted/50">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Sending</p>
          <AmountDisplay
            amount={transaction.sendAmount}
            currency={transaction.sendCurrency}
            size="sm"
            className="font-semibold"
          />
        </div>
        <CaretRight size={16} className="text-muted-foreground mx-2" />
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-0.5">Receiving</p>
          <AmountDisplay
            amount={transaction.receiveAmount}
            currency={transaction.receiveCurrency}
            size="sm"
            className="font-semibold"
          />
        </div>
      </div>

      {/* Footer: Recipient + Date */}
      <div className="flex items-center justify-between text-xs">
        <div className="min-w-0 flex-1">
          <span className="text-muted-foreground">To: </span>
          <span className="text-foreground">{transaction.recipientName}</span>
          <span className="text-muted-foreground"> ({transaction.recipientBank})</span>
        </div>
        <span className="text-muted-foreground shrink-0 ml-2">
          {formatRelativeTime(transaction.createdAt)}
        </span>
      </div>

      {/* Reference */}
      <div className="mt-2 pt-2 border-t border-border">
        <span className="font-mono text-xs text-muted-foreground">
          Ref: {transaction.reference}
        </span>
      </div>
    </div>
  );
}

export function TransactionTable({
  transactions,
  pagination,
  onView,
  onRetry,
  onRefund,
  className,
}: TransactionTableProps) {
  const router = useRouter();

  const handleRowClick = (transaction: Transaction) => {
    if (onView) {
      onView(transaction.id);
    } else {
      router.push(`/transactions/${transaction.id}`);
    }
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      id: 'reference',
      header: 'Reference',
      accessorKey: 'reference',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.reference}
        </span>
      ),
    },
    {
      id: 'sender',
      header: 'Sender',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.senderName} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {row.senderName}
            </span>
            <span className="text-xs text-muted-foreground">{row.senderPhone}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'recipient',
      header: 'Recipient',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {row.recipientName}
          </span>
          <span className="text-xs text-muted-foreground">{row.recipientBank}</span>
        </div>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col items-end">
          <AmountDisplay
            amount={row.sendAmount}
            currency={row.sendCurrency}
            size="sm"
          />
          <span className="text-xs text-muted-foreground">
            → <AmountDisplay
              amount={row.receiveAmount}
              currency={row.receiveCurrency}
              size="sm"
              className="text-xs text-muted-foreground"
            />
          </span>
        </div>
      ),
      className: 'text-right',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      id: 'date',
      header: 'Date',
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(row.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (row) => (
        <TransactionActions
          transaction={row}
          onView={onView}
          onRetry={onRetry}
          onRefund={onRefund}
        />
      ),
      className: 'w-10',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={transactions}
      pagination={pagination}
      onRowClick={handleRowClick}
      emptyMessage="No transactions found"
      className={className}
      mobileCardRender={(row, onClick) => (
        <TransactionMobileCard
          transaction={row}
          onRowClick={onClick}
        />
      )}
    />
  );
}

interface TransactionActionsProps {
  transaction: Transaction;
  onView?: (id: string) => void;
  onRetry?: (id: string) => void;
  onRefund?: (id: string) => void;
}

function TransactionActions({
  transaction,
  onView,
  onRetry,
  onRefund,
}: TransactionActionsProps) {
  const router = useRouter();
  const canRetry = transaction.status === 'failed';
  const canRefund = transaction.status === 'completed';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Transaction actions"
        >
          <DotsThree size={20} weight="bold" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[160px] rounded-lg border border-border bg-card p-1 shadow-lg"
          align="end"
          sideOffset={4}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground outline-none hover:bg-muted focus:bg-muted"
            onClick={() =>
              onView
                ? onView(transaction.id)
                : router.push(`/transactions/${transaction.id}`)
            }
          >
            <Eye size={16} />
            View Details
          </DropdownMenu.Item>

          {canRetry && (
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground outline-none hover:bg-muted focus:bg-muted"
              onClick={() => onRetry?.(transaction.id)}
            >
              <ArrowClockwise size={16} />
              Retry Transaction
            </DropdownMenu.Item>
          )}

          {canRefund && (
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-error outline-none hover:bg-error/10 focus:bg-error/10"
              onClick={() => onRefund?.(transaction.id)}
            >
              <ArrowUUpLeft size={16} />
              Refund
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
