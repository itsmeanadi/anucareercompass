import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Plus, X } from 'lucide-react';
import { OnboardingData } from '@/hooks/use-onboarding';

interface StepExperienceProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

export function StepExperience({ data, updateData }: StepExperienceProps) {
  const [newInternship, setNewInternship] = useState({ company: '', role: '', duration: '' });

  const addInternship = () => {
    if (newInternship.company && newInternship.role && newInternship.duration) {
      updateData({ 
        internshipDetails: [...data.internshipDetails, newInternship] 
      });
      setNewInternship({ company: '', role: '', duration: '' });
    }
  };

  const removeInternship = (index: number) => {
    updateData({ 
      internshipDetails: data.internshipDetails.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1f3445] mb-2">Experience & Exposure</h2>
        <p className="text-[#1f3445] font-medium">Share your professional experiences</p>
      </div>

      {/* Previous Internships */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-bold text-[#1f3445]">Previous Internships</Label>
          <Switch
            checked={data.hasPreviousInternships}
            onCheckedChange={(checked) => updateData({ hasPreviousInternships: checked })}
          />
        </div>

        {data.hasPreviousInternships && (
          <div className="space-y-4 pl-4 border-l-2 border-primary/30">
            {data.internshipDetails.map((internship, index) => (
              <div key={index} className="glass rounded-lg p-4 flex items-start justify-between">
                <div>
                  <p className="font-medium">{internship.company}</p>
                  <p className="text-sm text-[#1f3445]/80">{internship.role} • {internship.duration}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeInternship(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                placeholder="Company Name"
                value={newInternship.company}
                onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
              />
              <Input
                placeholder="Role"
                value={newInternship.role}
                onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
              />
              <Input
                placeholder="Duration (e.g., 3 months)"
                value={newInternship.duration}
                onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
              />
            </div>
            <Button variant="outline" size="sm" onClick={addInternship} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Internship
            </Button>
          </div>
        )}
      </div>

      {/* Hackathons */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-bold text-[#1f3445]">Hackathons / Case Competitions</Label>
          <p className="text-sm text-[#1f3445]/80 font-medium">Have you participated in any?</p>
        </div>
        <Switch
          checked={data.hasHackathonExperience}
          onCheckedChange={(checked) => updateData({ hasHackathonExperience: checked })}
        />
      </div>

      {/* Open Source / Research */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-bold text-[#1f3445]">Open Source / Research / Freelance</Label>
          <p className="text-sm text-[#1f3445]/80 font-medium">Any experience in these areas?</p>
        </div>
        <Switch
          checked={data.hasOpensourceExperience}
          onCheckedChange={(checked) => updateData({ hasOpensourceExperience: checked })}
        />
      </div>

      {/* Interview Comfort */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <Label className="text-base font-bold text-[#1f3445]">Comfort with Interviews</Label>
          <span className="text-sm font-bold text-[#1f3445]">{data.interviewComfort}/5</span>
        </div>
        <Slider
          value={[data.interviewComfort]}
          onValueChange={([value]) => updateData({ interviewComfort: value })}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#1f3445]/80">
          <span>Not confident</span>
          <span>Very confident</span>
        </div>
      </div>

      {/* Aptitude Comfort */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <Label className="text-base font-bold text-[#1f3445]">Comfort with Aptitude Tests</Label>
          <span className="text-sm font-bold text-[#1f3445]">{data.aptitudeComfort}/5</span>
        </div>
        <Slider
          value={[data.aptitudeComfort]}
          onValueChange={([value]) => updateData({ aptitudeComfort: value })}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#1f3445]/80">
          <span>Not confident</span>
          <span>Very confident</span>
        </div>
      </div>
    </div>
  );
}
