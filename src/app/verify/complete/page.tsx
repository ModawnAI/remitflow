import type { Metadata } from 'next';
import { KYCLayout } from '@/components/layouts/kyc-layout';
import { KYCCompletionCard } from '@/components/features/kyc-completion-card';
import { KYCProgress } from '@/components/features/kyc-progress';

export const metadata: Metadata = {
  title: 'Verification Complete | RemitFlow',
  description: 'Your identity verification is being processed',
};

export default function CompletePage() {
  return (
    <KYCLayout>
      <div className="w-full max-w-lg mx-auto space-y-6">
        <KYCProgress currentStep={3} totalSteps={3} />

        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-success-100 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-success-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Verification Submitted!
          </h1>
          <p className="text-neutral-600 mt-2">
            We&apos;re reviewing your documents. This usually takes a few minutes.
          </p>
        </div>

        <KYCCompletionCard />

        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h3 className="font-medium text-neutral-900">What happens next?</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Automatic verification</p>
                <p className="text-sm text-neutral-600">
                  Our system will verify your documents automatically
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">WhatsApp notification</p>
                <p className="text-sm text-neutral-600">
                  You&apos;ll receive a message when verification is complete
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Start sending money</p>
                <p className="text-sm text-neutral-600">
                  Once verified, you can send money instantly via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-500">
            Need help? Chat with us on WhatsApp or email support@remitflow.com
          </p>
        </div>
      </div>
    </KYCLayout>
  );
}
