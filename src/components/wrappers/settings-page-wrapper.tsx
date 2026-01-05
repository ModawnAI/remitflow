'use client';

import dynamic from 'next/dynamic';

const SettingsPageContent = dynamic(
  () => import('@/components/pages/settings-page-content').then((mod) => mod.SettingsPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded-xl" />
              <div className="h-64 bg-muted rounded-xl" />
            </div>
            <div className="h-80 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    ),
  }
);

interface FXSettings {
  currentRate: number;
  markup: number;
  lastUpdated: string;
  autoUpdate: boolean;
  updateFrequency: number;
  provider: string;
}

interface LimitSettings {
  tiers: Array<{
    tier: number;
    name: string;
    dailyLimit: number;
    monthlyLimit: number;
    singleTransactionLimit: number;
  }>;
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

interface SettingsPageWrapperProps {
  fxSettings: FXSettings;
  limitSettings: LimitSettings;
  notificationSettings: NotificationSettings;
}

export function SettingsPageWrapper({ fxSettings, limitSettings, notificationSettings }: SettingsPageWrapperProps) {
  return (
    <SettingsPageContent
      fxSettings={fxSettings}
      limitSettings={limitSettings}
      notificationSettings={notificationSettings}
    />
  );
}
