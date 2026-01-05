import type { Metadata } from 'next';
import { UsersPageWrapper } from '@/components/wrappers/users-page-wrapper';

export const metadata: Metadata = {
  title: 'Users | RemitFlow Admin',
  description: 'User management',
};

const mockUsers = [
  {
    id: 'usr-001',
    name: 'James Okafor',
    phone: '+44 7700 900010',
    email: 'james.okafor@email.com',
    kycStatus: 'verified' as const,
    kycTier: 2,
    transactionCount: 15,
    totalVolume: 7500,
    lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
    registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    status: 'active' as const,
  },
  {
    id: 'usr-002',
    name: 'Fatima Ahmed',
    phone: '+44 7700 900011',
    email: 'fatima.ahmed@email.com',
    kycStatus: 'pending' as const,
    kycTier: 1,
    transactionCount: 3,
    totalVolume: 750,
    lastActiveAt: new Date(Date.now() - 7200000).toISOString(),
    registeredAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: 'active' as const,
  },
  {
    id: 'usr-003',
    name: 'Chen Wei',
    phone: '+44 7700 900012',
    email: 'chen.wei@email.com',
    kycStatus: 'verified' as const,
    kycTier: 3,
    transactionCount: 42,
    totalVolume: 25000,
    lastActiveAt: new Date(Date.now() - 86400000).toISOString(),
    registeredAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    status: 'active' as const,
  },
  {
    id: 'usr-004',
    name: 'Mohammed Ali',
    phone: '+44 7700 900013',
    email: 'mohammed.ali@email.com',
    kycStatus: 'rejected' as const,
    kycTier: 0,
    transactionCount: 0,
    totalVolume: 0,
    lastActiveAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    registeredAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    status: 'suspended' as const,
  },
  {
    id: 'usr-005',
    name: 'Amara Diallo',
    phone: '+44 7700 900014',
    email: 'amara.diallo@email.com',
    kycStatus: 'verified' as const,
    kycTier: 2,
    transactionCount: 28,
    totalVolume: 12500,
    lastActiveAt: new Date().toISOString(),
    registeredAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    status: 'active' as const,
  },
];

export default async function UsersPage() {
  return <UsersPageWrapper users={mockUsers} />;
}
