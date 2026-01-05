'use client';

import { ClientDashboardLayout } from '@/components/layouts/client-dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { FXSettingsCard } from '@/components/features/fx-settings-card';
import { LimitSettingsCard } from '@/components/features/limit-settings-card';
import { NotificationSettingsCard } from '@/components/features/notification-settings-card';

interface FXSettings {
  currentRate: number;
  markup: number;
  lastUpdated: string;
  autoUpdate: boolean;
  updateFrequency: number;
  provider: string;
}

interface LimitTier {
  tier: number;
  name: string;
  dailyLimit: number;
  monthlyLimit: number;
  singleTransactionLimit: number;
}

interface LimitSettings {
  tiers: LimitTier[];
}

interface NotificationSettings {
  emailNotifications: {
    transactionComplete: boolean;
    transactionFailed: boolean;
    kycPending: boolean;
    dailySummary: boolean;
    weeklyReport: boolean;
  };
  slackNotifications: {
    enabled: boolean;
    webhookUrl: string;
    channels: {
      alerts: string;
      transactions: string;
    };
  };
  thresholds: {
    highValueTransaction: number;
    suspiciousActivity: number;
    failedTransactionsAlert: number;
  };
}

interface SettingsPageContentProps {
  fxSettings: FXSettings;
  limitSettings: LimitSettings;
  notificationSettings: NotificationSettings;
}

export function SettingsPageContent({ fxSettings, limitSettings, notificationSettings }: SettingsPageContentProps) {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Configure system settings and preferences"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FXSettingsCard settings={fxSettings} />
          <LimitSettingsCard settings={limitSettings} />
        </div>

        <NotificationSettingsCard settings={notificationSettings} />
      </div>
    </ClientDashboardLayout>
  );
}
