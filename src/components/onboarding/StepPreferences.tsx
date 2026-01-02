import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OnboardingData } from '@/hooks/use-onboarding';
import { Home, Building2, Shuffle, MapPin, Globe, Building } from 'lucide-react';

interface StepPreferencesProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

export function StepPreferences({ data, updateData }: StepPreferencesProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Logistics & Preferences</h2>
        <p className="text-muted-foreground">Set your preferences and constraints</p>
      </div>

      {/* Internship Type Preference */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Internship Type Preference</Label>
        <RadioGroup 
          value={data.internshipTypePreference} 
          onValueChange={(value) => updateData({ internshipTypePreference: value })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { value: "remote", label: "Work From Home", icon: Home, desc: "Remote" },
            { value: "onsite", label: "On-Site", icon: Building2, desc: "In-Office" },
            { value: "hybrid", label: "Hybrid", icon: Shuffle, desc: "Mix of both" },
          ].map((option) => (
            <div key={option.value} className="relative">
              <RadioGroupItem value={option.value} id={`type-${option.value}`} className="peer sr-only" />
              <Label 
                htmlFor={`type-${option.value}`}
                className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
              >
                <option.icon className="w-8 h-8 text-primary" />
                <span className="font-semibold">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.desc}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Preferred Duration */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Preferred Duration</Label>
        <RadioGroup 
          value={data.preferredDuration} 
          onValueChange={(value) => updateData({ preferredDuration: value })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {["1–2 Months", "3–4 Months", "6+ Months"].map((duration) => (
            <div key={duration} className="flex items-center space-x-2">
              <RadioGroupItem value={duration} id={`duration-${duration}`} />
              <Label htmlFor={`duration-${duration}`} className="cursor-pointer font-normal">{duration}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Government Internship Interest */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Interest in Government Internships</Label>
        <RadioGroup 
          value={data.govtInternshipInterest} 
          onValueChange={(value) => updateData({ govtInternshipInterest: value })}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { value: "high", label: "High", color: "text-green-500" },
            { value: "medium", label: "Medium", color: "text-yellow-500" },
            { value: "low", label: "Low", color: "text-red-400" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`govt-${option.value}`} />
              <Label htmlFor={`govt-${option.value}`} className={`cursor-pointer font-medium ${option.color}`}>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Relocation Readiness */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Relocation Readiness</Label>
        <RadioGroup 
          value={data.relocationReadiness} 
          onValueChange={(value) => updateData({ relocationReadiness: value })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { value: "anywhere", label: "Anywhere in India", icon: Globe },
            { value: "metro", label: "Metro Cities Only", icon: Building },
            { value: "no", label: "Cannot Relocate", icon: MapPin },
          ].map((option) => (
            <div key={option.value} className="relative">
              <RadioGroupItem value={option.value} id={`reloc-${option.value}`} className="peer sr-only" />
              <Label 
                htmlFor={`reloc-${option.value}`}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
              >
                <option.icon className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-center">{option.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
