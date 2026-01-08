import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Users, BarChart3 } from 'lucide-react';
import { OnboardingData } from '@/hooks/use-onboarding';

interface StepGuidanceProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

export function StepGuidance({ data, updateData }: StepGuidanceProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1f3445] mb-2">Social & Guidance</h2>
        <p className="text-[#1f3445] font-medium">Connect with mentors and peers</p>
      </div>

      {/* Senior Guidance */}
      <div className="glass rounded-2xl p-6 flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-[#1f3445]/10 flex items-center justify-center shrink-0">
          <Users className="w-7 h-7 text-[#1f3445]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#1f3445]">Senior Guidance</h3>
              <p className="text-[#1f3445]/80 text-sm mt-1 font-medium">
                Would you like guidance from verified seniors who have been through similar career paths?
              </p>
            </div>
            <Switch
              checked={data.wantsSeniorGuidance}
              onCheckedChange={(checked) => updateData({ wantsSeniorGuidance: checked })}
            />
          </div>
          {data.wantsSeniorGuidance && (
            <div className="mt-4 p-3 rounded-lg bg-[#1f3445]/5 border border-[#1f3445]/20">
              <p className="text-sm text-[#1f3445] font-medium">
                ✓ You'll be matched with seniors based on your field and goals
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Peer Comparison */}
      <div className="glass rounded-2xl p-6 flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-[#1f3445]/10 flex items-center justify-center shrink-0">
          <BarChart3 className="w-7 h-7 text-[#1f3445]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#1f3445]">Anonymous Peer Comparison</h3>
              <p className="text-[#1f3445]/80 text-sm mt-1 font-medium">
                See how you stack up against peers with similar profiles (completely anonymous)
              </p>
            </div>
            <Switch
              checked={data.wantsPeerComparison}
              onCheckedChange={(checked) => updateData({ wantsPeerComparison: checked })}
            />
          </div>
          {data.wantsPeerComparison && (
            <div className="mt-4 p-3 rounded-lg bg-[#1f3445]/5 border border-[#1f3445]/20">
              <p className="text-sm text-[#1f3445] font-medium">
                ✓ Your data is always anonymized and never shared directly
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Preview */}
      <div className="glass rounded-2xl p-6 mt-8">
        <h3 className="font-bold text-lg text-[#1f3445] mb-4">You're all set! 🎉</h3>
        <p className="text-[#1f3445]/80 text-sm font-medium">
          After completing onboarding, you'll receive:
        </p>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#1f3445]" />
            Personalized internship recommendations
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#1f3445]" />
            Placement readiness score
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#1f3445]" />
            Skill gap analysis & learning roadmap
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#1f3445]" />
            Eligibility alerts before applying
          </li>
        </ul>
      </div>
    </div>
  );
}
