import type { Metadata } from 'next';
import { KYCLayout } from '@/components/layouts/kyc-layout';
import { SelfieCapture } from '@/components/features/selfie-capture';
import { KYCProgress } from '@/components/features/kyc-progress';

export const metadata: Metadata = {
  title: 'Take Selfie | RemitFlow Verification',
  description: 'Take a selfie for identity verification',
};

export default function SelfiePage() {
  return (
    <KYCLayout>
      <div className="w-full max-w-lg mx-auto space-y-6">
        <KYCProgress currentStep={2} totalSteps={3} />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Take a Selfie
          </h1>
          <p className="text-neutral-600 mt-2">
            We&apos;ll compare your selfie with your ID photo
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <SelfieCapture />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 mb-2">For best results:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Find good lighting (natural light works best)</li>
            <li>• Look directly at the camera</li>
            <li>• Keep a neutral expression</li>
            <li>• Remove glasses, hats, or anything covering your face</li>
            <li>• Ensure your face is fully visible</li>
          </ul>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 text-lg">🔒</span>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900">Your privacy is protected</h4>
              <p className="text-sm text-neutral-600 mt-1">
                Your selfie is securely processed and encrypted. We use industry-standard
                biometric verification powered by Smile ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </KYCLayout>
  );
}
