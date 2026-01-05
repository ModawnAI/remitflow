import type { ReactNode } from 'react';
import { CurrencyGbp } from '@phosphor-icons/react/dist/ssr';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30">
            <CurrencyGbp size={36} weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">RemitFlow</h1>
          <p className="mt-1 text-sm text-neutral-500">Admin Portal</p>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-900/5">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} RemitFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
}
