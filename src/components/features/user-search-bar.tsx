'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, X, Funnel } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

interface UserSearchBarProps {
  onSearch?: (query: string, filters: UserFilters) => void;
}

interface UserFilters {
  kycStatus: string;
  status: string;
}

export function UserSearchBar({ onSearch }: UserSearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    kycStatus: 'all',
    status: 'all',
  });

  const handleSearch = useCallback(() => {
    onSearch?.(query, filters);
  }, [query, filters, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({ kycStatus: 'all', status: 'all' });
    onSearch?.('', { kycStatus: 'all', status: 'all' });
  };

  const hasActiveFilters = filters.kycStatus !== 'all' || filters.status !== 'all';

  return (
    <div className="space-y-4">
      {/* Mobile: stack search and buttons, Desktop: single row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search by name, phone, or email..."
            icon={<MagnifyingGlass size={18} />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {(query || hasActiveFilters) && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Buttons row - always horizontal */}
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant={showFilters || hasActiveFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 flex-1 sm:flex-none"
          >
            <Funnel size={18} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded">
                {(filters.kycStatus !== 'all' ? 1 : 0) + (filters.status !== 'all' ? 1 : 0)}
              </span>
            )}
          </Button>

          <Button variant="primary" onClick={handleSearch} className="flex-1 sm:flex-none gap-2">
            <MagnifyingGlass size={18} className="sm:hidden" />
            <span className="hidden sm:inline">Search</span>
            <span className="sm:hidden">Search</span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-neutral-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="KYC Status"
                value={filters.kycStatus}
                onValueChange={(value) => setFilters({ ...filters, kycStatus: value })}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'verified', label: 'Verified' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'rejected', label: 'Rejected' },
                  { value: 'not_started', label: 'Not Started' },
                ]}
              />

              <Select
                label="Account Status"
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
                options={[
                  { value: 'all', label: 'All Accounts' },
                  { value: 'active', label: 'Active' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />

              <div className="sm:col-span-2 flex items-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ kycStatus: 'all', status: 'all' })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
