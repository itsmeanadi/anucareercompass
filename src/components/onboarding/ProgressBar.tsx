import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Academic',
  'Skills',
  'Experience',
  'Preferences',
  'Goals',
  'Guidance'
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div 
                    className={cn(
                      "flex-1 h-1 transition-colors duration-300",
                      step <= currentStep ? "bg-primary" : "bg-border"
                    )} 
                  />
                )}
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shrink-0",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground glow",
                    !isCompleted && !isCurrent && "bg-secondary text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step}
                </div>
                {i < totalSteps - 1 && (
                  <div 
                    className={cn(
                      "flex-1 h-1 transition-colors duration-300",
                      step < currentStep ? "bg-primary" : "bg-border"
                    )} 
                  />
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 hidden sm:block transition-colors",
                  isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
