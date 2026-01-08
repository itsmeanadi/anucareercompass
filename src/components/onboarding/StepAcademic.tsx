import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingData } from '@/hooks/use-onboarding';

interface StepAcademicProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

const universities = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "BITS Pilani", "NIT Trichy", "NIT Warangal", "VIT Vellore", "SRM Chennai",
  "Delhi University", "Mumbai University", "Anna University", "JNTU Hyderabad",
  "Other"
];

export function StepAcademic({ data, updateData }: StepAcademicProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1f3445] mb-2">Academic & Eligibility</h2>
        <p className="text-[#1f3445] font-medium">Help us understand your academic background</p>
      </div>

      {/* Year of Study */}
      <div className="space-y-3">
        <Label className="text-base font-bold text-[#1f3445]">Current Year of Study</Label>
        <Select value={data.yearOfStudy} onValueChange={(value) => updateData({ yearOfStudy: value })}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select your year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1st Year">1st Year</SelectItem>
            <SelectItem value="2nd Year">2nd Year</SelectItem>
            <SelectItem value="3rd Year">3rd Year</SelectItem>
            <SelectItem value="4th Year (Final Year)">4th Year (Final Year)</SelectItem>
            <SelectItem value="Graduate / Post-Graduate">Graduate / Post-Graduate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CGPA Range */}
      <div className="space-y-3">
        <Label className="text-base font-bold text-[#1f3445]">Current CGPA Range</Label>
        <RadioGroup 
          value={data.cgpaRange} 
          onValueChange={(value) => updateData({ cgpaRange: value })}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {["9.0 – 10.0", "8.0 – 8.9", "7.0 – 7.9", "6.0 – 6.9", "Below 6.0"].map((range) => (
            <div key={range} className="flex items-center space-x-2">
              <RadioGroupItem value={range} id={`cgpa-${range}`} />
              <Label htmlFor={`cgpa-${range}`} className="cursor-pointer text-[#1f3445] font-medium">{range}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Active Backlogs */}
      <div className="space-y-3">
        <Label className="text-base font-bold text-[#1f3445]">Active Backlogs</Label>
        <RadioGroup 
          value={data.activeBacklogs} 
          onValueChange={(value) => updateData({ activeBacklogs: value })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {["Zero Backlogs", "1–2 Active Backlogs", "3+ Active Backlogs"].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`backlog-${option}`} />
              <Label htmlFor={`backlog-${option}`} className="cursor-pointer text-[#1f3445] font-medium">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Education Stream */}
      <div className="space-y-3">
        <Label className="text-base font-bold text-[#1f3445]">Primary Education Stream</Label>
        <RadioGroup 
          value={data.educationStream} 
          onValueChange={(value) => updateData({ educationStream: value })}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {[
            "Engineering / Technology",
            "Management / MBA",
            "Commerce / Finance",
            "Arts / Humanities / Law",
            "Pure Sciences (B.Sc / M.Sc)"
          ].map((stream) => (
            <div key={stream} className="flex items-center space-x-2">
              <RadioGroupItem value={stream} id={`stream-${stream}`} />
              <Label htmlFor={`stream-${stream}`} className="cursor-pointer text-[#1f3445] font-medium">{stream}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* University */}
      <div className="space-y-3">
        <Label className="text-base font-bold text-[#1f3445]">University / College Name</Label>
        <Select value={data.universityName} onValueChange={(value) => updateData({ universityName: value })}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Search or select your university" />
          </SelectTrigger>
          <SelectContent>
            {universities.map((uni) => (
              <SelectItem key={uni} value={uni}>{uni}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Degree & Branch */}
      <div className="space-y-3">
        <Label className="text-base font-bold text-[#1f3445]">Degree & Branch / Specialization</Label>
        <Input 
          placeholder="e.g., B.Tech Computer Science"
          className="h-12"
          value={data.degreeBranch}
          onChange={(e) => updateData({ degreeBranch: e.target.value })}
        />
      </div>
    </div>
  );
}
