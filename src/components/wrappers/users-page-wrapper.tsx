'use client';

import dynamic from 'next/dynamic';

const UsersPageContent = dynamic(
  () => import('@/components/pages/users-page-content').then((mod) => mod.UsersPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-96 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    ),
  }
);

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

interface UsersPageWrapperProps {
  users: User[];
}

export function UsersPageWrapper({ users }: UsersPageWrapperProps) {
  return <UsersPageContent users={users} />;
}
