'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

// Dynamically import DashboardLayout with SSR disabled to avoid
// framer-motion context issues during SSR
const DashboardLayoutInner = dynamic(
  () => import('./dashboard-layout').then((mod) => mod.DashboardLayout),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-border rounded mb-4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    ),
  }
);

interface ClientDashboardLayoutProps {
  children: ReactNode;
}

export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  return <DashboardLayoutInner>{children}</DashboardLayoutInner>;
}
