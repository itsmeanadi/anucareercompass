import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Code,
  Users,
  Car,
  Target,
  BookOpen,
  MessageSquare,
  Star,
  MapPin,
  IndianRupee,
  Clock,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { toast } from 'sonner';

interface FormData {
  yearOfStudy: string;
  cgpaRange: string;
  activeBacklogs: string;
  educationStream: string;
  universityName: string;
  degreeBranch: string;
  targetIndustries: string[];
  primaryTechnicalStrength: string;
  secondarySkills: string[];
  certificationStatus: string;
  projectExperienceLevel: string;
  hasPreviousInternships: boolean;
  internshipDetails: string;
  hasHackathonExperience: boolean;
  hasOpensourceExperience: boolean;
  interviewComfort: number;
  aptitudeComfort: number;
  internshipTypePreference: string;
  preferredDuration: string;
  govtInternshipInterest: string;
  relocationReadiness: string;
  primaryGoal: string;
  targetCompanies: string[];
  weeklyCommitmentHours: number;
  learningStyle: string;
  wantsSeniorGuidance: boolean;
  wantsPeerComparison: boolean;
  additionalInfo: string;
}

interface StepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

// Step components
const StepAcademic = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1f3445]">Academic Information</h2>
    <p className="text-[#1f3445]/80">Tell us about your academic background</p>

    <div className="space-y-4">
      <div>
        <Label htmlFor="yearOfStudy" className="text-[#1f3445] font-bold">Current Year of Study</Label>
        <Select value={formData.yearOfStudy} onValueChange={(value) => updateFormData({ yearOfStudy: value })}>
          <SelectTrigger className="border-[#1f3445]/30 text-[#1f3445]">
            <SelectValue placeholder="Select your year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1st Year">1st Year</SelectItem>
            <SelectItem value="2nd Year">2nd Year</SelectItem>
            <SelectItem value="3rd Year">3rd Year</SelectItem>
            <SelectItem value="4th Year">4th Year</SelectItem>
            <SelectItem value="Graduate">Graduate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="cgpaRange" className="text-[#1f3445] font-bold">CGPA Range</Label>
        <Select value={formData.cgpaRange} onValueChange={(value) => updateFormData({ cgpaRange: value })}>
          <SelectTrigger className="border-[#1f3445]/30 text-[#1f3445]">
            <SelectValue placeholder="Select your CGPA range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Below 6.0">Below 6.0</SelectItem>
            <SelectItem value="6.0-7.0">6.0-7.0</SelectItem>
            <SelectItem value="7.0-8.0">7.0-8.0</SelectItem>
            <SelectItem value="8.0-9.0">8.0-9.0</SelectItem>
            <SelectItem value="Above 9.0">Above 9.0</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Active Backlogs</Label>
        <RadioGroup
          value={formData.activeBacklogs}
          onValueChange={(value) => updateFormData({ activeBacklogs: value })}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="backlogs-none" />
            <Label htmlFor="backlogs-none" className="text-[#1f3445]">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1-2" id="backlogs-some" />
            <Label htmlFor="backlogs-some" className="text-[#1f3445]">1-2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="more-than-2" id="backlogs-many" />
            <Label htmlFor="backlogs-many" className="text-[#1f3445]">More than 2</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="educationStream" className="text-[#1f3445] font-bold">Education Stream</Label>
        <Input
          id="educationStream"
          value={formData.educationStream}
          onChange={(e) => updateFormData({ educationStream: e.target.value })}
          placeholder="e.g., Computer Science, Mechanical Engineering"
          className="border-[#1f3445]/30 text-[#1f3445]"
        />
      </div>

      <div>
        <Label htmlFor="universityName" className="text-[#1f3445] font-bold">University/College Name</Label>
        <Input
          id="universityName"
          value={formData.universityName}
          onChange={(e) => updateFormData({ universityName: e.target.value })}
          placeholder="Enter your institution name"
          className="border-[#1f3445]/30 text-[#1f3445]"
        />
      </div>

      <div>
        <Label htmlFor="degreeBranch" className="text-[#1f3445] font-bold">Degree Branch</Label>
        <Input
          id="degreeBranch"
          value={formData.degreeBranch}
          onChange={(e) => updateFormData({ degreeBranch: e.target.value })}
          placeholder="e.g., Computer Science Engineering"
          className="border-[#1f3445]/30 text-[#1f3445]"
        />
      </div>
    </div>
  </div>
);

const StepSkills = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1f3445]">Skills & Expertise</h2>
    <p className="text-[#1f3445]/80">Help us understand your technical strengths</p>

    <div className="space-y-4">
      <div>
        <Label htmlFor="targetIndustries" className="text-[#1f3445] font-bold">Target Industries</Label>
        <Textarea
          id="targetIndustries"
          value={formData.targetIndustries.join(', ')}
          onChange={(e) => updateFormData({ targetIndustries: e.target.value.split(',').map((item: string) => item.trim()) })}
          placeholder="e.g., Technology, Finance, Healthcare"
          className="border-[#1f3445]/30 text-[#1f3445] min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="primaryTechnicalStrength" className="text-[#1f3445] font-bold">Primary Technical Strength</Label>
        <Input
          id="primaryTechnicalStrength"
          value={formData.primaryTechnicalStrength}
          onChange={(e) => updateFormData({ primaryTechnicalStrength: e.target.value })}
          placeholder="e.g., Frontend Development, Data Analysis, Machine Learning"
          className="border-[#1f3445]/30 text-[#1f3445]"
        />
      </div>

      <div>
        <Label htmlFor="secondarySkills" className="text-[#1f3445] font-bold">Secondary Skills</Label>
        <Textarea
          id="secondarySkills"
          value={formData.secondarySkills.join(', ')}
          onChange={(e) => updateFormData({ secondarySkills: e.target.value.split(',').map((item: string) => item.trim()) })}
          placeholder="e.g., JavaScript, Python, React, SQL"
          className="border-[#1f3445]/30 text-[#1f3445] min-h-[100px]"
        />
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Certification Status</Label>
        <RadioGroup
          value={formData.certificationStatus}
          onValueChange={(value) => updateFormData({ certificationStatus: value })}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="cert-none" />
            <Label htmlFor="cert-none" className="text-[#1f3445]">No certifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-progress" id="cert-progress" />
            <Label htmlFor="cert-progress" className="text-[#1f3445]">Working on certifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="completed" id="cert-completed" />
            <Label htmlFor="cert-completed" className="text-[#1f3445]">Have certifications</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Project Experience Level</Label>
        <RadioGroup
          value={formData.projectExperienceLevel}
          onValueChange={(value) => updateFormData({ projectExperienceLevel: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="beginner" id="proj-beginner" />
            <Label htmlFor="proj-beginner" className="text-[#1f3445]">Beginner (0-1 projects)</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="intermediate" id="proj-intermediate" />
            <Label htmlFor="proj-intermediate" className="text-[#1f3445]">Intermediate (2-5 projects)</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="advanced" id="proj-advanced" />
            <Label htmlFor="proj-advanced" className="text-[#1f3445]">Advanced (6+ projects)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  </div>
);

const StepExperience = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1f3445]">Experience & Exposure</h2>
    <p className="text-[#1f3445]/80">Tell us about your professional exposure</p>

    <div className="space-y-4">
      <div>
        <Label className="text-[#1f3445] font-bold">Previous Internships</Label>
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasInternships"
              checked={formData.hasPreviousInternships}
              onCheckedChange={(checked) => updateFormData({ hasPreviousInternships: checked === true })}
            />
            <Label htmlFor="hasInternships" className="text-[#1f3445]">I have previous internship experience</Label>
          </div>
        </div>
      </div>

      {formData.hasPreviousInternships && (
        <div className="border-l-4 border-[#1f3445]/30 pl-4 ml-2">
          <Label htmlFor="internshipDetails" className="text-[#1f3445] font-bold">Internship Details</Label>
          <Textarea
            id="internshipDetails"
            value={formData.internshipDetails}
            onChange={(e) => updateFormData({ internshipDetails: e.target.value })}
            placeholder="Describe your previous internships (company, role, duration, key responsibilities)"
            className="border-[#1f3445]/30 text-[#1f3445] min-h-[120px]"
          />
        </div>
      )}

      <div>
        <Label className="text-[#1f3445] font-bold">Hackathon Experience</Label>
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasHackathon"
              checked={formData.hasHackathonExperience}
              onCheckedChange={(checked) => updateFormData({ hasHackathonExperience: checked === true })}
            />
            <Label htmlFor="hasHackathon" className="text-[#1f3445]">I have participated in hackathons</Label>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Open Source Contribution</Label>
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasOpensource"
              checked={formData.hasOpensourceExperience}
              onCheckedChange={(checked) => updateFormData({ hasOpensourceExperience: checked === true })}
            />
            <Label htmlFor="hasOpensource" className="text-[#1f3445]">I have contributed to open source projects</Label>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Interview Comfort Level</Label>
        <RadioGroup
          value={formData.interviewComfort.toString()}
          onValueChange={(value) => updateFormData({ interviewComfort: parseInt(value) })}
          className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2"
        >
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className="flex items-center space-x-2 p-2 border border-[#1f3445]/30 rounded-lg text-center">
              <RadioGroupItem value={level.toString()} id={`interview-${level}`} />
              <Label htmlFor={`interview-${level}`} className="text-[#1f3445]">{level}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex justify-between text-xs text-[#1f3445]/70 mt-1">
          <span>Very uncomfortable</span>
          <span>Very comfortable</span>
        </div>
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Aptitude Test Comfort Level</Label>
        <RadioGroup
          value={formData.aptitudeComfort.toString()}
          onValueChange={(value) => updateFormData({ aptitudeComfort: parseInt(value) })}
          className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2"
        >
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className="flex items-center space-x-2 p-2 border border-[#1f3445]/30 rounded-lg text-center">
              <RadioGroupItem value={level.toString()} id={`aptitude-${level}`} />
              <Label htmlFor={`aptitude-${level}`} className="text-[#1f3445]">{level}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex justify-between text-xs text-[#1f3445]/70 mt-1">
          <span>Very uncomfortable</span>
          <span>Very comfortable</span>
        </div>
      </div>
    </div>
  </div>
);

const StepPreferences = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1f3445]">Logistics & Preferences</h2>
    <p className="text-[#1f3445]/80">Share your preferences for internships</p>

    <div className="space-y-4">
      <div>
        <Label className="text-[#1f3445] font-bold">Internship Type Preference</Label>
        <RadioGroup
          value={formData.internshipTypePreference}
          onValueChange={(value) => updateFormData({ internshipTypePreference: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="remote" id="type-remote" />
            <Label htmlFor="type-remote" className="text-[#1f3445]">Remote</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="hybrid" id="type-hybrid" />
            <Label htmlFor="type-hybrid" className="text-[#1f3445]">Hybrid</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="onsite" id="type-onsite" />
            <Label htmlFor="type-onsite" className="text-[#1f3445]">On-site</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="preferredDuration" className="text-[#1f3445] font-bold">Preferred Duration</Label>
        <Select value={formData.preferredDuration} onValueChange={(value) => updateFormData({ preferredDuration: value })}>
          <SelectTrigger className="border-[#1f3445]/30 text-[#1f3445]">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-2 months">1-2 months</SelectItem>
            <SelectItem value="2-3 months">2-3 months</SelectItem>
            <SelectItem value="3-4 months">3-4 months</SelectItem>
            <SelectItem value="4-6 months">4-6 months</SelectItem>
            <SelectItem value="6+ months">6+ months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Government Internship Interest</Label>
        <RadioGroup
          value={formData.govtInternshipInterest}
          onValueChange={(value) => updateFormData({ govtInternshipInterest: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="very-interested" id="gov-very" />
            <Label htmlFor="gov-very" className="text-[#1f3445]">Very Interested</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="somewhat-interested" id="gov-some" />
            <Label htmlFor="gov-some" className="text-[#1f3445]">Somewhat Interested</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="not-interested" id="gov-not" />
            <Label htmlFor="gov-not" className="text-[#1f3445]">Not Interested</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Relocation Readiness</Label>
        <RadioGroup
          value={formData.relocationReadiness}
          onValueChange={(value) => updateFormData({ relocationReadiness: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="ready" id="reloc-ready" />
            <Label htmlFor="reloc-ready" className="text-[#1f3445]">Ready to relocate</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="willing-to-consider" id="reloc-consider" />
            <Label htmlFor="reloc-consider" className="text-[#1f3445]">Willing to consider</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="not-ready" id="reloc-not-ready" />
            <Label htmlFor="reloc-not-ready" className="text-[#1f3445]">Not ready</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  </div>
);

const StepGoals = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1f3445]">Career Intent</h2>
    <p className="text-[#1f3445]/80">What are your career goals?</p>

    <div className="space-y-4">
      <div>
        <Label htmlFor="primaryGoal" className="text-[#1f3445] font-bold">Primary Goal</Label>
        <Select value={formData.primaryGoal} onValueChange={(value) => updateFormData({ primaryGoal: value })}>
          <SelectTrigger className="border-[#1f3445]/30 text-[#1f3445]">
            <SelectValue placeholder="Select your primary goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical-growth">Technical Growth</SelectItem>
            <SelectItem value="leadership-development">Leadership Development</SelectItem>
            <SelectItem value="domain-expertise">Domain Expertise</SelectItem>
            <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
            <SelectItem value="research">Research</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="targetCompanies" className="text-[#1f3445] font-bold">Target Companies</Label>
        <Textarea
          id="targetCompanies"
          value={formData.targetCompanies.join(', ')}
          onChange={(e) => updateFormData({ targetCompanies: e.target.value.split(',').map((item: string) => item.trim()) })}
          placeholder="e.g., Google, Microsoft, Amazon, Startup X"
          className="border-[#1f3445]/30 text-[#1f3445] min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="weeklyCommitmentHours" className="text-[#1f3445] font-bold">Weekly Commitment Hours</Label>
        <Input
          id="weeklyCommitmentHours"
          type="number"
          min="0"
          max="100"
          value={formData.weeklyCommitmentHours}
          onChange={(e) => updateFormData({ weeklyCommitmentHours: parseInt(e.target.value) || 0 })}
          placeholder="e.g., 20"
          className="border-[#1f3445]/30 text-[#1f3445]"
        />
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Learning Style</Label>
        <RadioGroup
          value={formData.learningStyle}
          onValueChange={(value) => updateFormData({ learningStyle: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="visual" id="learn-visual" />
            <Label htmlFor="learn-visual" className="text-[#1f3445]">Visual (diagrams, videos)</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="auditory" id="learn-auditory" />
            <Label htmlFor="learn-auditory" className="text-[#1f3445]">Auditory (lectures, discussions)</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-[#1f3445]/30 rounded-lg">
            <RadioGroupItem value="kinesthetic" id="learn-kinesthetic" />
            <Label htmlFor="learn-kinesthetic" className="text-[#1f3445]">Kinesthetic (hands-on practice)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  </div>
);

const StepGuidance = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1f3445]">Social & Guidance</h2>
    <p className="text-[#1f3445]/80">How can we best support you?</p>

    <div className="space-y-4">
      <div>
        <Label className="text-[#1f3445] font-bold">Senior Guidance</Label>
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wantsGuidance"
              checked={formData.wantsSeniorGuidance}
              onCheckedChange={(checked) => updateFormData({ wantsSeniorGuidance: checked === true })}
            />
            <Label htmlFor="wantsGuidance" className="text-[#1f3445]">I want guidance from seniors who've succeeded</Label>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-[#1f3445] font-bold">Peer Comparison</Label>
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wantsComparison"
              checked={formData.wantsPeerComparison}
              onCheckedChange={(checked) => updateFormData({ wantsPeerComparison: checked === true })}
            />
            <Label htmlFor="wantsComparison" className="text-[#1f3445]">I want to see how I compare with peers</Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="additionalInfo" className="text-[#1f3445] font-bold">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          value={formData.additionalInfo}
          onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
          placeholder="Any other information you'd like to share..."
          className="border-[#1f3445]/30 text-[#1f3445] min-h-[120px]"
        />
      </div>
    </div>
  </div>
);

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Academic
    yearOfStudy: '',
    cgpaRange: '',
    activeBacklogs: 'none',
    educationStream: '',
    universityName: '',
    degreeBranch: '',

    // Skills
    targetIndustries: [],
    primaryTechnicalStrength: '',
    secondarySkills: [],
    certificationStatus: 'none',
    projectExperienceLevel: 'beginner',

    // Experience
    hasPreviousInternships: false,
    internshipDetails: '',
    hasHackathonExperience: false,
    hasOpensourceExperience: false,
    interviewComfort: 3,
    aptitudeComfort: 3,

    // Preferences
    internshipTypePreference: 'remote',
    preferredDuration: '',
    govtInternshipInterest: 'somewhat-interested',
    relocationReadiness: 'willing-to-consider',

    // Goals
    primaryGoal: '',
    targetCompanies: [],
    weeklyCommitmentHours: 20,
    learningStyle: 'visual',

    // Guidance
    wantsSeniorGuidance: false,
    wantsPeerComparison: false,
    additionalInfo: ''
  });

  const { user } = useAuth();
  const { userRole } = useRole();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Save to Firebase Firestore
      if (user) {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userRef = doc(db, 'users', user.uid);

        // Update user's onboarding data in Firestore
        await setDoc(userRef, {
          onboardingData: formData,
          onboardingCompleted: true,
          updatedAt: new Date()
        }, { merge: true });

        toast.success('Onboarding completed successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error('Failed to save onboarding data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepAcademic formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <StepSkills formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <StepExperience formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <StepPreferences formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <StepGoals formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <StepGuidance formData={formData} updateFormData={updateFormData} />;
      default:
        return <StepAcademic formData={formData} updateFormData={updateFormData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1f3445] to-slate-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Perfect Placement</span>
          </div>
          <span className="text-sm font-bold text-[#1f3445]">Step {currentStep} of {totalSteps}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="glass rounded-2xl p-6 sm:p-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="h-12 px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep} className="h-12 px-8 bg-[#1f3445] hover:bg-[#1f3445]/90 text-white">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="h-12 px-8 bg-[#1f3445] hover:bg-[#1f3445]/90 text-white"
            >
              {submitting && <span className="animate-spin mr-2">⏳</span>}
              Complete Setup
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}