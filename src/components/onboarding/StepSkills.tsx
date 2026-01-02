import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingData } from '@/hooks/use-onboarding';

interface StepSkillsProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

const industries = [
  { id: "sde", label: "Software Development (SDE)" },
  { id: "data", label: "Data Science & AI" },
  { id: "pm", label: "Product Management / Business Analyst" },
  { id: "core", label: "Core Engineering" },
  { id: "finance", label: "Finance & Investment Banking" },
  { id: "marketing", label: "Digital Marketing & Creative Arts" },
  { id: "govt", label: "Government & Public Sector" },
];

const technicalStrengths = [
  "Programming (C++, Java, Python, etc.)",
  "Data Analysis (Excel, SQL, Tableau)",
  "Design (UI/UX, Canva, Adobe)",
  "Writing & Communication",
  "Project / Operations Management"
];

const secondarySkillOptions = [
  "Machine Learning / AI",
  "Web Development",
  "Mobile Development",
  "Cloud Computing (AWS/GCP/Azure)",
  "DevOps / CI-CD",
  "Cybersecurity",
  "Blockchain",
  "Database Management",
  "Data Visualization"
];

export function StepSkills({ data, updateData }: StepSkillsProps) {
  const toggleIndustry = (industry: string) => {
    const current = data.targetIndustries;
    const updated = current.includes(industry)
      ? current.filter(i => i !== industry)
      : [...current, industry];
    updateData({ targetIndustries: updated });
  };

  const toggleSecondarySkill = (skill: string) => {
    const current = data.secondarySkills;
    const updated = current.includes(skill)
      ? current.filter(s => s !== skill)
      : [...current, skill];
    updateData({ secondarySkills: updated });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Domain & Skills</h2>
        <p className="text-muted-foreground">Tell us about your skills and target domains</p>
      </div>

      {/* Target Industries */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Target Industry (Select all that apply)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {industries.map((industry) => (
            <div key={industry.id} className="flex items-center space-x-3">
              <Checkbox 
                id={industry.id}
                checked={data.targetIndustries.includes(industry.id)}
                onCheckedChange={() => toggleIndustry(industry.id)}
              />
              <Label htmlFor={industry.id} className="cursor-pointer font-normal">{industry.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Core Engineering Type */}
      {data.targetIndustries.includes("core") && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Core Engineering Specialization</Label>
          <Select value={data.coreEngineeringType} onValueChange={(value) => updateData({ coreEngineeringType: value })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
              <SelectItem value="Electrical">Electrical (EE)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Primary Technical Strength */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Primary Technical Strength</Label>
        <RadioGroup 
          value={data.primaryTechnicalStrength} 
          onValueChange={(value) => updateData({ primaryTechnicalStrength: value })}
          className="grid grid-cols-1 gap-3"
        >
          {technicalStrengths.map((strength) => (
            <div key={strength} className="flex items-center space-x-2">
              <RadioGroupItem value={strength} id={`strength-${strength}`} />
              <Label htmlFor={`strength-${strength}`} className="cursor-pointer font-normal">{strength}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Secondary Skills */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Secondary Skill Areas</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {secondarySkillOptions.map((skill) => (
            <div key={skill} className="flex items-center space-x-3">
              <Checkbox 
                id={`secondary-${skill}`}
                checked={data.secondarySkills.includes(skill)}
                onCheckedChange={() => toggleSecondarySkill(skill)}
              />
              <Label htmlFor={`secondary-${skill}`} className="cursor-pointer font-normal">{skill}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Status */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Certification Status</Label>
        <RadioGroup 
          value={data.certificationStatus} 
          onValueChange={(value) => updateData({ certificationStatus: value })}
          className="grid grid-cols-1 gap-3"
        >
          {["3+ Industry Certifications", "1–2 Industry Certifications", "No Certifications yet"].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <RadioGroupItem value={status} id={`cert-${status}`} />
              <Label htmlFor={`cert-${status}`} className="cursor-pointer font-normal">{status}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Project Experience Level */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Project Experience Level</Label>
        <RadioGroup 
          value={data.projectExperienceLevel} 
          onValueChange={(value) => updateData({ projectExperienceLevel: value })}
          className="grid grid-cols-1 gap-3"
        >
          {[
            "Beginner (Academic Projects Only)",
            "Intermediate (Self-Initiated Projects)",
            "Advanced (Industry / Startup Projects)"
          ].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level} id={`project-${level}`} />
              <Label htmlFor={`project-${level}`} className="cursor-pointer font-normal">{level}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
