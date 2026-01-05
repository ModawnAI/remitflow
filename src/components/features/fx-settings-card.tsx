'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyGbp,
  ArrowsClockwise,
  Pencil,
  Check,
  X,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';

interface FXSettings {
  currentRate: number;
  markup: number;
  lastUpdated: string;
  autoUpdate: boolean;
  updateFrequency: number;
  provider: string;
}

interface FXSettingsCardProps {
  settings: FXSettings;
  onSave?: (settings: Partial<FXSettings>) => void;
}

export function FXSettingsCard({ settings, onSave }: FXSettingsCardProps) {
  const [editing, setEditing] = useState(false);
  const [markup, setMarkup] = useState(settings.markup.toString());
  const [saving, setSaving] = useState(false);

  const effectiveRate = settings.currentRate * (1 + settings.markup / 100);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.({ markup: parseFloat(markup) });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setMarkup(settings.markup.toString());
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <CurrencyGbp size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Exchange Rate Settings</h3>
              <p className="text-sm text-neutral-500">GBP to NGN conversion rates</p>
            </div>
          </div>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil size={18} />
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Current Rate Display */}
          <div className="bg-neutral-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Mid-market Rate</span>
              <span className="text-sm text-neutral-500">
                Updated {formatRelativeTime(settings.lastUpdated)}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900">
                ₦{settings.currentRate.toLocaleString()}
              </span>
              <span className="text-neutral-500">per £1</span>
            </div>
          </div>

          {/* Markup Setting */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Markup (%)</label>
            {editing ? (
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-32"
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    loading={saving}
                  >
                    <Check size={16} />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-neutral-900">{settings.markup}%</p>
            )}
          </div>

          {/* Effective Rate */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Effective Customer Rate</span>
              <span className="text-xl font-bold text-primary-600">
                ₦{effectiveRate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Auto-update Settings */}
          <div className="pt-4 border-t border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Auto-update rates</span>
              <span className={`text-sm font-medium ${settings.autoUpdate ? 'text-green-600' : 'text-neutral-400'}`}>
                {settings.autoUpdate ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Update frequency</span>
              <span className="text-sm text-neutral-900">Every {settings.updateFrequency} minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Rate provider</span>
              <span className="text-sm text-neutral-900">{settings.provider}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2">
            <ArrowsClockwise size={18} />
            Refresh Rate Now
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
