'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowsOut,
  X,
  CheckCircle,
  XCircle,
  Clock,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';
import type { KYCDocument } from '@/types';
import { cn, formatRelativeTime } from '@/lib/utils';

export interface DocumentViewerProps {
  documents: KYCDocument[];
  className?: string;
}

const documentTypeLabels: Record<KYCDocument['type'], string> = {
  passport: 'Passport',
  driving_license: 'Driving License',
  national_id: 'National ID',
  selfie: 'Selfie',
  proof_of_address: 'Proof of Address',
};

const statusIcons = {
  pending: { icon: Clock, color: 'text-warning', bgColor: 'bg-warning/10' },
  approved: { icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
  rejected: { icon: XCircle, color: 'text-error', bgColor: 'bg-error/10' },
};

export function DocumentViewer({ documents, className }: DocumentViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedDocument = documents[selectedIndex];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : documents.length - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < documents.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  if (documents.length === 0) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-8 text-center', className)}>
        <p className="text-muted-foreground">No documents uploaded</p>
      </div>
    );
  }

  const StatusIcon = statusIcons[selectedDocument.status].icon;

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {/* Document Thumbnails */}
      <div className="flex gap-2 border-b border-border p-3">
        {documents.map((doc, index) => {
          const status = statusIcons[doc.status];
          return (
            <button
              key={doc.id}
              onClick={() => {
                setSelectedIndex(index);
                setZoom(1);
              }}
              className={cn(
                'relative flex h-16 w-16 items-center justify-center rounded-lg border-2 bg-muted transition-all',
                index === selectedIndex
                  ? 'border-accent ring-2 ring-accent/20'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              <img
                src={doc.url}
                alt={documentTypeLabels[doc.type]}
                className="h-full w-full rounded-md object-cover"
              />
              <div className={cn('absolute -right-1 -top-1 rounded-full p-0.5', status.bgColor)}>
                <status.icon size={12} className={status.color} weight="fill" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Viewer */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {documentTypeLabels[selectedDocument.type]}
            </span>
            <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs', statusIcons[selectedDocument.status].bgColor)}>
              <StatusIcon size={12} className={statusIcons[selectedDocument.status].color} weight="fill" />
              <span className={cn('capitalize', statusIcons[selectedDocument.status].color)}>
                {selectedDocument.status}
              </span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Uploaded {formatRelativeTime(selectedDocument.uploadedAt)}
          </span>
        </div>

        {/* Image Container */}
        <div className="relative h-[400px] overflow-hidden bg-inverted">
          {/* Navigation Arrows */}
          {documents.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70"
              >
                <CaretLeft size={24} weight="bold" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70"
              >
                <CaretRight size={24} weight="bold" />
              </button>
            </>
          )}

          {/* Image */}
          <motion.div
            className="flex h-full w-full items-center justify-center"
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
          >
            <motion.img
              src={selectedDocument.url}
              alt={documentTypeLabels[selectedDocument.type]}
              className="max-h-full max-w-full object-contain"
              style={{ transform: `scale(${zoom})` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag={zoom > 1}
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            />
          </motion.div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/70 px-2 py-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <MagnifyingGlassMinus size={18} />
            </button>
            <button
              onClick={handleResetZoom}
              className="min-w-[48px] px-2 text-xs text-white"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <MagnifyingGlassPlus size={18} />
            </button>
            <div className="mx-1 h-4 w-px bg-white/30" />
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
            >
              <ArrowsOut size={18} />
            </button>
          </div>
        </div>

        {/* Document Index */}
        <div className="flex items-center justify-center gap-1 py-2">
          {documents.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                setZoom(1);
              }}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                index === selectedIndex ? 'w-4 bg-accent' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={24} />
            </button>
            <img
              src={selectedDocument.url}
              alt={documentTypeLabels[selectedDocument.type]}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
