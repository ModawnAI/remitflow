'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  EnvelopeSimple,
  SlackLogo,
  ToggleLeft,
  ToggleRight,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

interface NotificationSettingsCardProps {
  settings: NotificationSettings;
  onSave?: (settings: NotificationSettings) => void;
}

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors text-left"
    >
      <div>
        <p className="font-medium text-neutral-900">{label}</p>
        {description && <p className="text-sm text-neutral-500">{description}</p>}
      </div>
      {enabled ? (
        <ToggleRight size={32} weight="fill" className="text-primary-600" />
      ) : (
        <ToggleLeft size={32} className="text-neutral-300" />
      )}
    </button>
  );
}

export function NotificationSettingsCard({ settings, onSave }: NotificationSettingsCardProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateEmailSetting = (key: keyof typeof settings.emailNotifications, value: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      emailNotifications: { ...prev.emailNotifications, [key]: value },
    }));
    setHasChanges(true);
  };

  const updateSlackSetting = (key: string, value: boolean | string) => {
    setLocalSettings((prev) => ({
      ...prev,
      slackNotifications: { ...prev.slackNotifications, [key]: value },
    }));
    setHasChanges(true);
  };

  const updateThreshold = (key: keyof typeof settings.thresholds, value: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      thresholds: { ...prev.thresholds, [key]: parseFloat(value) || 0 },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.(localSettings);
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Bell size={24} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Notification Settings</h3>
            <p className="text-sm text-neutral-500">Configure alerts and notifications</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Email Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <EnvelopeSimple size={20} className="text-neutral-600" />
              <h4 className="font-medium text-neutral-900">Email Notifications</h4>
            </div>
            <div className="space-y-1 -mx-3">
              <ToggleSwitch
                enabled={localSettings.emailNotifications.transactionComplete}
                onChange={(v) => updateEmailSetting('transactionComplete', v)}
                label="Transaction Complete"
                description="Notify when transactions are completed successfully"
              />
              <ToggleSwitch
                enabled={localSettings.emailNotifications.transactionFailed}
                onChange={(v) => updateEmailSetting('transactionFailed', v)}
                label="Transaction Failed"
                description="Alert when transactions fail"
              />
              <ToggleSwitch
                enabled={localSettings.emailNotifications.kycPending}
                onChange={(v) => updateEmailSetting('kycPending', v)}
                label="KYC Pending Review"
                description="Notify when new KYC applications need review"
              />
              <ToggleSwitch
                enabled={localSettings.emailNotifications.dailySummary}
                onChange={(v) => updateEmailSetting('dailySummary', v)}
                label="Daily Summary"
                description="Receive daily transaction summary at 9am"
              />
              <ToggleSwitch
                enabled={localSettings.emailNotifications.weeklyReport}
                onChange={(v) => updateEmailSetting('weeklyReport', v)}
                label="Weekly Report"
                description="Receive weekly performance report"
              />
            </div>
          </div>

          {/* Slack Integration */}
          <div className="pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-2 mb-4">
              <SlackLogo size={20} className="text-neutral-600" />
              <h4 className="font-medium text-neutral-900">Slack Integration</h4>
            </div>
            <div className="-mx-3 mb-4">
              <ToggleSwitch
                enabled={localSettings.slackNotifications.enabled}
                onChange={(v) => updateSlackSetting('enabled', v)}
                label="Enable Slack Notifications"
                description="Send alerts to Slack channels"
              />
            </div>
            {localSettings.slackNotifications.enabled && (
              <div className="space-y-4 pl-4 border-l-2 border-neutral-200">
                <div>
                  <label className="text-sm font-medium text-neutral-700 block mb-1">
                    Webhook URL
                  </label>
                  <Input
                    type="url"
                    value={localSettings.slackNotifications.webhookUrl}
                    onChange={(e) => updateSlackSetting('webhookUrl', e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 block mb-1">
                      Alerts Channel
                    </label>
                    <Input
                      value={localSettings.slackNotifications.channels.alerts}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          slackNotifications: {
                            ...prev.slackNotifications,
                            channels: { ...prev.slackNotifications.channels, alerts: e.target.value },
                          },
                        }))
                      }
                      placeholder="#alerts"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 block mb-1">
                      Transactions Channel
                    </label>
                    <Input
                      value={localSettings.slackNotifications.channels.transactions}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          slackNotifications: {
                            ...prev.slackNotifications,
                            channels: { ...prev.slackNotifications.channels, transactions: e.target.value },
                          },
                        }))
                      }
                      placeholder="#transactions"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alert Thresholds */}
          <div className="pt-6 border-t border-neutral-200">
            <h4 className="font-medium text-neutral-900 mb-4">Alert Thresholds</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-1">
                  High-Value Transaction (£)
                </label>
                <Input
                  type="number"
                  value={localSettings.thresholds.highValueTransaction}
                  onChange={(e) => updateThreshold('highValueTransaction', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-1">
                  Suspicious Activity Score
                </label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localSettings.thresholds.suspiciousActivity}
                  onChange={(e) => updateThreshold('suspiciousActivity', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-1">
                  Failed Transactions Alert
                </label>
                <Input
                  type="number"
                  value={localSettings.thresholds.failedTransactionsAlert}
                  onChange={(e) => updateThreshold('failedTransactionsAlert', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-neutral-200"
          >
            <Button
              variant="primary"
              onClick={handleSave}
              loading={saving}
              className="w-full"
            >
              Save Changes
            </Button>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
