import type { Metadata } from 'next';
import { KYCLayout } from '@/components/layouts/kyc-layout';
import { KYCIntroCard } from '@/components/features/kyc-intro-card';
import { KYCStartButton } from '@/components/features/kyc-start-button';

export const metadata: Metadata = {
  title: 'Verify Your Identity | RemitFlow',
  description: 'Complete identity verification to start sending money',
};

export default function VerifyPage() {
  return (
    <KYCLayout>
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Verify Your Identity
          </h1>
          <p className="text-neutral-600 mt-2">
            Quick and secure verification to unlock all features
          </p>
        </div>

        <KYCIntroCard />

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <h3 className="font-medium text-neutral-900 mb-3">
              What you&apos;ll need:
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Valid government-issued ID (passport, driving licence, or national ID)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                A device with a camera for selfie verification
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Good lighting for clear photos
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <h3 className="font-medium text-neutral-900 mb-3">
              Verification takes about 2 minutes
            </h3>
            <div className="flex items-center gap-6 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <span>Upload ID</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <span>Take selfie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium">
                  3
                </div>
                <span>Done!</span>
              </div>
            </div>
          </div>

          <KYCStartButton />
        </div>
      </div>
    </KYCLayout>
  );
}
