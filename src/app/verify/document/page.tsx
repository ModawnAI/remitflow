import type { Metadata } from 'next';
import { KYCLayout } from '@/components/layouts/kyc-layout';
import { DocumentCapture } from '@/components/features/document-capture';
import { KYCProgress } from '@/components/features/kyc-progress';

export const metadata: Metadata = {
  title: 'Upload Document | RemitFlow Verification',
  description: 'Upload your identity document for verification',
};

export default function DocumentPage() {
  return (
    <KYCLayout>
      <div className="w-full max-w-lg mx-auto space-y-6">
        <KYCProgress currentStep={1} totalSteps={3} />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Upload Your ID Document
          </h1>
          <p className="text-neutral-600 mt-2">
            Take a clear photo of your identity document
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="mb-6">
            <h3 className="font-medium text-neutral-900 mb-2">
              Accepted documents:
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg border border-neutral-200 hover:border-primary-500 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-neutral-900">Passport</div>
              </div>
              <div className="text-center p-3 rounded-lg border border-neutral-200 hover:border-primary-500 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-neutral-900">Driving Licence</div>
              </div>
              <div className="text-center p-3 rounded-lg border border-neutral-200 hover:border-primary-500 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-neutral-900">National ID</div>
              </div>
            </div>
          </div>

          <DocumentCapture />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-medium text-amber-900 mb-2">Tips for a good photo:</h4>
          <ul className="space-y-1 text-sm text-amber-800">
            <li>• Ensure all corners of the document are visible</li>
            <li>• Avoid glare and shadows</li>
            <li>• Make sure text is readable</li>
            <li>• Use a plain, dark background</li>
          </ul>
        </div>
      </div>
    </KYCLayout>
  );
}
