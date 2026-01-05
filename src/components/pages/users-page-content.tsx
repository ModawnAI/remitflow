'use client';

import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { UserSearchBar } from '@/components/features/user-search-bar';
import { UserTable } from '@/components/features/user-table';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycTier: number;
  transactionCount: number;
  totalVolume: number;
  lastActiveAt: string;
  registeredAt: string;
  status: 'active' | 'suspended' | 'blocked';
}

interface UsersPageContentProps {
  users: User[];
}

export function UsersPageContent({ users }: UsersPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Users"
          description="Manage user accounts and view activity"
        />

        <UserSearchBar />

        <div className="bg-card rounded-xl border border-border">
          <UserTable users={users} />
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
