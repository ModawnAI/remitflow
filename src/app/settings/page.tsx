import type { Metadata } from 'next';
import { SettingsPageWrapper } from '@/components/wrappers/settings-page-wrapper';

export const metadata: Metadata = {
  title: 'Settings | RemitFlow Admin',
  description: 'System configuration and settings',
};

const mockFXSettings = {
  currentRate: 1650,
  markup: 0.5,
  lastUpdated: new Date(Date.now() - 300000).toISOString(),
  autoUpdate: true,
  updateFrequency: 15,
  provider: 'Open Exchange Rates',
};

const mockLimitSettings = {
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      dailyLimit: 500,
      monthlyLimit: 2000,
      singleTransactionLimit: 250,
    },
    {
      tier: 2,
      name: 'Verified',
      dailyLimit: 2500,
      monthlyLimit: 10000,
      singleTransactionLimit: 1000,
    },
    {
      tier: 3,
      name: 'Premium',
      dailyLimit: 10000,
      monthlyLimit: 50000,
      singleTransactionLimit: 5000,
    },
  ],
};

const mockNotificationSettings = {
  emailNotifications: {
    transactionComplete: true,
    transactionFailed: true,
    kycPending: true,
    dailySummary: true,
    weeklyReport: false,
  },
  slackNotifications: {
    enabled: true,
    webhookUrl: 'https://hooks.slack.com/services/xxx',
    channels: {
      alerts: '#remitflow-alerts',
      transactions: '#remitflow-transactions',
    },
  },
  thresholds: {
    highValueTransaction: 1000,
    suspiciousActivity: 0.8,
    failedTransactionsAlert: 5,
  },
};

export default async function SettingsPage() {
  return (
    <SettingsPageWrapper
      fxSettings={mockFXSettings}
      limitSettings={mockLimitSettings}
      notificationSettings={mockNotificationSettings}
    />
  );
}
