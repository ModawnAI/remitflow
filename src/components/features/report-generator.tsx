'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  CaretDown,
  Export,
  CircleNotch,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ReportType = 'transactions' | 'volume' | 'kyc' | 'failed' | 'users';

interface ReportGeneratorProps {
  onGenerate?: (config: ReportConfig) => void;
}

interface ReportConfig {
  type: ReportType;
  dateFrom: string;
  dateTo: string;
  format: 'pdf' | 'csv' | 'xlsx';
}

const reportTypes: { value: ReportType; label: string; description: string }[] = [
  { value: 'transactions', label: 'Transaction Report', description: 'All transactions with details' },
  { value: 'volume', label: 'Volume Report', description: 'Transaction volumes and trends' },
  { value: 'kyc', label: 'KYC Compliance', description: 'Verification statistics' },
  { value: 'failed', label: 'Failed Transactions', description: 'Failed transaction analysis' },
  { value: 'users', label: 'User Report', description: 'User activity summary' },
];

export function ReportGenerator({ onGenerate }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('transactions');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!dateFrom || !dateTo) return;

    setGenerating(true);
    try {
      await onGenerate?.({
        type: reportType,
        dateFrom,
        dateTo,
        format,
      });
      // TODO: Actually generate and download report
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setGenerating(false);
    }
  };

  const setQuickDateRange = (days: number) => {
    const to = new Date();
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateFrom(from.toISOString().split('T')[0]);
    setDateTo(to.toISOString().split('T')[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <FileText size={24} className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Generate Report</h3>
            <p className="text-sm text-neutral-500">Create custom reports</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Report Type */}
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Report Type
            </label>
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value as ReportType)}
              options={reportTypes.map((t) => ({ value: t.value, label: t.label }))}
            />
            <p className="text-xs text-neutral-500 mt-1">
              {reportTypes.find((t) => t.value === reportType)?.description}
            </p>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                icon={<Calendar size={18} />}
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                icon={<Calendar size={18} />}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setQuickDateRange(7)}
                className="text-xs text-primary-600 hover:underline"
              >
                Last 7 days
              </button>
              <button
                onClick={() => setQuickDateRange(30)}
                className="text-xs text-primary-600 hover:underline"
              >
                Last 30 days
              </button>
              <button
                onClick={() => setQuickDateRange(90)}
                className="text-xs text-primary-600 hover:underline"
              >
                Last 90 days
              </button>
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Export Format
            </label>
            <div className="flex gap-2">
              {(['pdf', 'csv', 'xlsx'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    format === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            disabled={!dateFrom || !dateTo || generating}
            className="w-full mt-4"
          >
            {generating ? (
              <>
                <CircleNotch size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Export size={20} />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
