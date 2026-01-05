'use client';

import { useState } from 'react';
import { Funnel, X, MagnifyingGlass } from '@phosphor-icons/react';
import { Button, Input, Select, type SelectOption } from '@/components/ui';
import type { TransactionFilters, TransactionStatus } from '@/types';
import { cn } from '@/lib/utils';

export interface TransactionFiltersProps {
  filters?: TransactionFilters;
  onFilterChange?: (filters: TransactionFilters) => void;
  className?: string;
}

const statusOptions: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

export function TransactionFilters({
  filters: externalFilters,
  onFilterChange: externalOnFilterChange,
  className,
}: TransactionFiltersProps) {
  const [internalFilters, setInternalFilters] = useState<TransactionFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Use external filters/handler if provided, otherwise use internal state
  const filters = externalFilters ?? internalFilters;
  const onFilterChange = externalOnFilterChange ?? setInternalFilters;

  const handleStatusChange = (value: string) => {
    const newStatus =
      value === 'all' ? undefined : ([value] as TransactionStatus[]);
    onFilterChange({ ...filters, status: newStatus });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search: search || undefined });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onFilterChange({ ...filters, [field]: value || undefined });
  };

  const handleAmountChange = (field: 'amountMin' | 'amountMax', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onFilterChange({ ...filters, [field]: numValue });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = !!(
    filters.status?.length ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin ||
    filters.amountMax ||
    filters.search
  );

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search by reference, name..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            icon={<MagnifyingGlass size={18} />}
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
          <Select
            options={statusOptions}
            value={filters.status?.[0] || 'all'}
            onValueChange={handleStatusChange}
            placeholder="Status"
          />
        </div>

        {/* Toggle Advanced */}
        <Button
          variant="outline"
          size="sm"
          icon={<Funnel size={16} />}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Less Filters' : 'More Filters'}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={16} />}
            onClick={clearFilters}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="w-full sm:w-40">
            <Input
              type="date"
              label="From Date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleDateChange('dateFrom', e.target.value)}
            />
          </div>
          <div className="w-full sm:w-40">
            <Input
              type="date"
              label="To Date"
              value={filters.dateTo || ''}
              onChange={(e) => handleDateChange('dateTo', e.target.value)}
            />
          </div>
          <div className="w-full sm:w-32">
            <Input
              type="number"
              label="Min Amount"
              placeholder="0.00"
              value={filters.amountMin?.toString() || ''}
              onChange={(e) => handleAmountChange('amountMin', e.target.value)}
            />
          </div>
          <div className="w-full sm:w-32">
            <Input
              type="number"
              label="Max Amount"
              placeholder="10000.00"
              value={filters.amountMax?.toString() || ''}
              onChange={(e) => handleAmountChange('amountMax', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status?.map((status) => (
            <FilterTag
              key={status}
              label={`Status: ${status}`}
              onRemove={() =>
                onFilterChange({
                  ...filters,
                  status: filters.status?.filter((s) => s !== status),
                })
              }
            />
          ))}
          {filters.dateFrom && (
            <FilterTag
              label={`From: ${filters.dateFrom}`}
              onRemove={() => handleDateChange('dateFrom', '')}
            />
          )}
          {filters.dateTo && (
            <FilterTag
              label={`To: ${filters.dateTo}`}
              onRemove={() => handleDateChange('dateTo', '')}
            />
          )}
          {filters.amountMin !== undefined && (
            <FilterTag
              label={`Min: £${filters.amountMin}`}
              onRemove={() => handleAmountChange('amountMin', '')}
            />
          )}
          {filters.amountMax !== undefined && (
            <FilterTag
              label={`Max: £${filters.amountMax}`}
              onRemove={() => handleAmountChange('amountMax', '')}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-primary-100"
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} />
      </button>
    </span>
  );
}
