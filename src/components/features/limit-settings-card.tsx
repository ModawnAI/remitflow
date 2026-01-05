'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Pencil, Check, X } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface TierLimit {
  tier: number;
  name: string;
  dailyLimit: number;
  monthlyLimit: number;
  singleTransactionLimit: number;
}

interface LimitSettings {
  tiers: TierLimit[];
}

interface LimitSettingsCardProps {
  settings: LimitSettings;
  onSave?: (settings: LimitSettings) => void;
}

export function LimitSettingsCard({ settings, onSave }: LimitSettingsCardProps) {
  const [editing, setEditing] = useState(false);
  const [editedTiers, setEditedTiers] = useState<TierLimit[]>(settings.tiers);
  const [saving, setSaving] = useState(false);

  const handleTierChange = (tierIndex: number, field: keyof TierLimit, value: string) => {
    setEditedTiers((prev) =>
      prev.map((tier, idx) =>
        idx === tierIndex ? { ...tier, [field]: parseFloat(value) || 0 } : tier
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.({ tiers: editedTiers });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedTiers(settings.tiers);
    setEditing(false);
  };

  const tierColors = [
    'bg-neutral-100 text-neutral-700',
    'bg-primary-100 text-primary-700',
    'bg-secondary-100 text-secondary-700',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
              <Gauge size={24} className="text-secondary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Transaction Limits</h3>
              <p className="text-sm text-neutral-500">Limits by KYC verification tier</p>
            </div>
          </div>
          {!editing ? (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil size={18} />
              Edit
            </Button>
          ) : (
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
          )}
        </div>

        <div className="space-y-4">
          {(editing ? editedTiers : settings.tiers).map((tier, index) => (
            <div
              key={tier.tier}
              className="bg-neutral-50 rounded-xl p-4 space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[index]}`}>
                  Tier {tier.tier}
                </span>
                <span className="font-medium text-neutral-900">{tier.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Daily Limit</label>
                  {editing ? (
                    <Input
                      type="number"
                      value={tier.dailyLimit}
                      onChange={(e) => handleTierChange(index, 'dailyLimit', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <p className="font-semibold text-neutral-900">
                      {formatCurrency(tier.dailyLimit, 'GBP')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Monthly Limit</label>
                  {editing ? (
                    <Input
                      type="number"
                      value={tier.monthlyLimit}
                      onChange={(e) => handleTierChange(index, 'monthlyLimit', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <p className="font-semibold text-neutral-900">
                      {formatCurrency(tier.monthlyLimit, 'GBP')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Single Transaction</label>
                  {editing ? (
                    <Input
                      type="number"
                      value={tier.singleTransactionLimit}
                      onChange={(e) => handleTierChange(index, 'singleTransactionLimit', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <p className="font-semibold text-neutral-900">
                      {formatCurrency(tier.singleTransactionLimit, 'GBP')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
