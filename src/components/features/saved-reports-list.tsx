'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Clock,
  CheckCircle,
  CircleNotch,
  XCircle,
  ArrowsLeftRight,
  ChartLine,
  IdentificationCard,
  Warning,
  Users,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';

interface SavedReport {
  id: string;
  name: string;
  type: 'transactions' | 'volume' | 'kyc' | 'failed' | 'users';
  dateRange: {
    from: string;
    to: string;
  };
  createdAt: string;
  createdBy: string;
  status: 'completed' | 'generating' | 'failed';
  downloadUrl?: string;
}

interface SavedReportsListProps {
  reports: SavedReport[];
  onDownload?: (reportId: string) => void;
  onRetry?: (reportId: string) => void;
}

const typeIcons: Record<SavedReport['type'], React.ElementType> = {
  transactions: ArrowsLeftRight,
  volume: ChartLine,
  kyc: IdentificationCard,
  failed: Warning,
  users: Users,
};

const statusConfig: Record<SavedReport['status'], { icon: React.ElementType; color: string; label: string }> = {
  completed: { icon: CheckCircle, color: 'text-green-600', label: 'Ready' },
  generating: { icon: CircleNotch, color: 'text-primary-600', label: 'Generating...' },
  failed: { icon: XCircle, color: 'text-red-600', label: 'Failed' },
};

export function SavedReportsList({ reports, onDownload, onRetry }: SavedReportsListProps) {
  if (reports.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <FileText size={32} className="text-neutral-400" />
        </div>
        <h3 className="font-medium text-neutral-900 mb-1">No Reports</h3>
        <p className="text-sm text-neutral-500">
          Generate your first report to see it here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-neutral-100">
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">Saved Reports</h3>
        <span className="text-sm text-neutral-500">{reports.length} reports</span>
      </div>

      {reports.map((report, index) => {
        const TypeIcon = typeIcons[report.type];
        const status = statusConfig[report.status];
        const StatusIcon = status.icon;

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <TypeIcon size={20} className="text-neutral-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{report.name}</p>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                    <Clock size={14} />
                    {formatRelativeTime(report.createdAt)}
                    <span className="text-neutral-300">•</span>
                    <span>{report.createdBy}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(report.dateRange.from).toLocaleDateString()} -{' '}
                    {new Date(report.dateRange.to).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 text-sm ${status.color}`}>
                  <StatusIcon
                    size={16}
                    weight="fill"
                    className={report.status === 'generating' ? 'animate-spin' : ''}
                  />
                  <span>{status.label}</span>
                </div>

                {report.status === 'completed' && report.downloadUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload?.(report.id)}
                  >
                    <Download size={16} />
                    Download
                  </Button>
                )}

                {report.status === 'failed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry?.(report.id)}
                  >
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </Card>
  );
}
