'use client';

import { forwardRef } from 'react';

/**
 * Articulink Stepper Component
 *
 * Step indicator for multi-step forms and wizards.
 *
 * Usage:
 *   <Stepper
 *     steps={['Account', 'Profile', 'Review']}
 *     currentStep={1}
 *   />
 *
 *   <Stepper
 *     steps={[
 *       { label: 'Details', description: 'Enter your info' },
 *       { label: 'Payment', description: 'Add payment method' },
 *       { label: 'Confirm', description: 'Review and submit' }
 *     ]}
 *     currentStep={2}
 *     variant="detailed"
 *   />
 */

export interface StepperStep {
  label: string;
  description?: string;
}

export type StepperVariant = 'simple' | 'detailed';
export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: (string | StepperStep)[];
  currentStep: number;
  variant?: StepperVariant;
  orientation?: StepperOrientation;
  onStepClick?: (step: number) => void;
}

function normalizeStep(step: string | StepperStep): StepperStep {
  return typeof step === 'string' ? { label: step } : step;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      variant = 'simple',
      orientation = 'horizontal',
      onStepClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const normalizedSteps = steps.map(normalizeStep);
    const isHorizontal = orientation === 'horizontal';

    return (
      <div
        ref={ref}
        className={`
          ${isHorizontal ? 'flex items-center' : 'flex flex-col'}
          ${className}
        `}
        aria-label="Progress"
        {...props}
      >
        {normalizedSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div
              key={index}
              className={`
                ${isHorizontal ? 'flex items-center' : 'flex'}
                ${index < normalizedSteps.length - 1 ? 'flex-1' : ''}
              `}
            >
              {/* Step indicator */}
              <div
                className={`
                  ${isHorizontal ? '' : 'flex items-start gap-3'}
                `}
              >
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick?.(stepNumber)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center
                    w-8 h-8 rounded-full
                    text-sm font-semibold
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
                    ${isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                        ? 'bg-tide text-white'
                        : 'bg-mist text-lagoon'
                    }
                    ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-tide/30' : 'cursor-default'}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </button>

                {/* Labels for vertical or detailed variant */}
                {(variant === 'detailed' || !isHorizontal) && (
                  <div className={isHorizontal ? 'absolute mt-10 -ml-4 w-24 text-center' : ''}>
                    <p
                      className={`
                        text-sm font-medium
                        ${isCurrent ? 'text-abyss' : isCompleted ? 'text-success-text' : 'text-lagoon'}
                      `}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-lagoon mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Connector line */}
              {index < normalizedSteps.length - 1 && (
                <div
                  className={`
                    ${isHorizontal
                      ? 'flex-1 h-0.5 mx-2'
                      : 'w-0.5 h-8 ml-4 my-1'
                    }
                    ${isCompleted ? 'bg-success' : 'bg-mist'}
                    transition-colors duration-200
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

/**
 * StepperContent - Container for step content with navigation
 */
export interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const StepperContent = forwardRef<HTMLDivElement, StepperContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`mt-8 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

StepperContent.displayName = 'StepperContent';

export default Stepper;
