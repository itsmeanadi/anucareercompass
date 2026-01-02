import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Target, FileText, Briefcase, Compass, BookOpen, Wrench, Users } from 'lucide-react';
import { OnboardingData } from '@/hooks/use-onboarding';

interface StepGoalsProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

const goals = [
  { value: "skill", label: "Skill Building", icon: Wrench, desc: "Learn new technologies" },
  { value: "resume", label: "Resume Building", icon: FileText, desc: "Enhance your profile" },
  { value: "ppo", label: "PPO / Full-Time", icon: Briefcase, desc: "Convert to job offer" },
  { value: "explore", label: "Exploration", icon: Compass, desc: "Discover your path" },
];

const learningStyles = [
  { value: "roadmaps", label: "Structured Roadmaps", icon: Target },
  { value: "projects", label: "Hands-on Projects", icon: Wrench },
  { value: "mentorship", label: "Mentorship-Driven", icon: Users },
];

export function StepGoals({ data, updateData }: StepGoalsProps) {
  const [newCompany, setNewCompany] = useState('');

  const addCompany = () => {
    if (newCompany.trim() && !data.targetCompanies.includes(newCompany.trim())) {
      updateData({ targetCompanies: [...data.targetCompanies, newCompany.trim()] });
      setNewCompany('');
    }
  };

  const removeCompany = (company: string) => {
    updateData({ targetCompanies: data.targetCompanies.filter(c => c !== company) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCompany();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Career Intent & Learning</h2>
        <p className="text-muted-foreground">Define your goals and learning preferences</p>
      </div>

      {/* Primary Goal */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Primary Goal</Label>
        <RadioGroup 
          value={data.primaryGoal} 
          onValueChange={(value) => updateData({ primaryGoal: value })}
          className="grid grid-cols-2 gap-4"
        >
          {goals.map((goal) => (
            <div key={goal.value} className="relative">
              <RadioGroupItem value={goal.value} id={`goal-${goal.value}`} className="peer sr-only" />
              <Label 
                htmlFor={`goal-${goal.value}`}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
              >
                <goal.icon className="w-7 h-7 text-primary" />
                <span className="font-semibold">{goal.label}</span>
                <span className="text-xs text-muted-foreground text-center">{goal.desc}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Target Companies */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Target Companies / Roles (Optional)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Google, Microsoft, Data Analyst"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12"
          />
          <Button onClick={addCompany} variant="outline" className="h-12 px-6">
            Add
          </Button>
        </div>
        {data.targetCompanies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.targetCompanies.map((company) => (
              <Badge key={company} variant="secondary" className="px-3 py-1.5 text-sm">
                {company}
                <button onClick={() => removeCompany(company)} className="ml-2 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Time Commitment */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <Label className="text-base font-medium">Weekly Time for Skill Growth</Label>
          <span className="text-sm font-semibold text-primary">{data.weeklyCommitmentHours} hours</span>
        </div>
        <Slider
          value={[data.weeklyCommitmentHours]}
          onValueChange={([value]) => updateData({ weeklyCommitmentHours: value })}
          min={1}
          max={40}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 hr/week</span>
          <span>40 hrs/week</span>
        </div>
      </div>

      {/* Learning Style */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Learning Style Preference</Label>
        <RadioGroup 
          value={data.learningStyle} 
          onValueChange={(value) => updateData({ learningStyle: value })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {learningStyles.map((style) => (
            <div key={style.value} className="relative">
              <RadioGroupItem value={style.value} id={`style-${style.value}`} className="peer sr-only" />
              <Label 
                htmlFor={`style-${style.value}`}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-border cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
              >
                <style.icon className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-center">{style.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
