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
                      step <= currentStep ? "bg-[#1f3445]" : "bg-[#1f3445]/30"
                    )} 
                  />
                )}
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shrink-0",
                    isCompleted && "bg-[#1f3445] text-white",
                    isCurrent && "bg-[#1f3445] text-white glow",
                    !isCompleted && !isCurrent && "bg-[#1f3445]/20 text-[#1f3445]"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step}
                </div>
                {i < totalSteps - 1 && (
                  <div 
                    className={cn(
                      "flex-1 h-1 transition-colors duration-300",
                      step < currentStep ? "bg-[#1f3445]" : "bg-[#1f3445]/30"
                    )} 
                  />
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 hidden sm:block transition-colors font-bold",
                  isCurrent ? "text-[#1f3445] font-bold" : "text-[#1f3445]/70"
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
