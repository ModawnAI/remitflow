'use client';

import { CheckCircle, Circle, Spinner } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

type StepStatus = 'completed' | 'current' | 'upcoming';

interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

export interface KYCProgressProps {
  currentStep: number;
  totalSteps?: number;
  steps?: Step[];
  className?: string;
}

const defaultSteps: Step[] = [
  { id: 'intro', label: 'Introduction', status: 'completed' },
  { id: 'document', label: 'Document Upload', status: 'current' },
  { id: 'selfie', label: 'Selfie Verification', status: 'upcoming' },
  { id: 'complete', label: 'Complete', status: 'upcoming' },
];

export function KYCProgress({ currentStep, totalSteps, steps, className }: KYCProgressProps) {
  // If custom steps are provided, use them
  // Otherwise, generate steps based on totalSteps or use default
  const progressSteps = steps || (totalSteps
    ? Array.from({ length: totalSteps }, (_, index) => ({
        id: `step-${index}`,
        label: `Step ${index + 1}`,
        status: index < currentStep ? 'completed' as const : index === currentStep ? 'current' as const : 'upcoming' as const,
      }))
    : defaultSteps.map((step, index) => ({
        ...step,
        status: index < currentStep ? 'completed' as const : index === currentStep ? 'current' as const : 'upcoming' as const,
      }))
  );

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {progressSteps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  step.status === 'completed' && 'border-success bg-success text-white',
                  step.status === 'current' && 'border-accent bg-accent/5 text-accent',
                  step.status === 'upcoming' && 'border-border bg-card text-muted-foreground'
                )}
              >
                {step.status === 'completed' ? (
                  <CheckCircle size={24} weight="fill" />
                ) : step.status === 'current' ? (
                  <Spinner size={24} className="animate-spin" />
                ) : (
                  <Circle size={24} />
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  step.status === 'completed' && 'text-success',
                  step.status === 'current' && 'text-accent',
                  step.status === 'upcoming' && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < progressSteps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1',
                  index < currentStep ? 'bg-success' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
