'use client';

import type { ReactNode } from 'react';
import { CurrencyGbp, ArrowLeft } from '@phosphor-icons/react';

interface KYCLayoutProps {
  children: ReactNode;
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
}

export function KYCLayout({ children, step = 1, totalSteps = 3, onBack }: KYCLayoutProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-10" />
          )}

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white">
              <CurrencyGbp size={18} weight="bold" />
            </div>
            <span className="font-semibold text-neutral-900">RemitFlow</span>
          </div>

          <div className="w-10" />
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-neutral-100">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-4">
        <div className="mx-auto max-w-md px-4 text-center">
          <p className="text-xs text-neutral-500">
            Your data is protected with bank-level encryption
          </p>
        </div>
      </footer>
    </div>
  );
}
