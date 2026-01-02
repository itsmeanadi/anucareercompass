import { useState } from 'react';

export interface OnboardingData {
  // Section 1: Academic & Eligibility
  yearOfStudy: string;
  cgpaRange: string;
  activeBacklogs: string;
  educationStream: string;
  universityName: string;
  degreeBranch: string;
  
  // Section 2: Domain & Skills
  targetIndustries: string[];
  coreEngineeringType: string;
  primaryTechnicalStrength: string;
  secondarySkills: string[];
  certificationStatus: string;
  certificationFiles: File[];
  projectExperienceLevel: string;
  
  // Section 3: Experience & Exposure
  hasPreviousInternships: boolean;
  internshipDetails: { company: string; role: string; duration: string }[];
  hasHackathonExperience: boolean;
  hasOpensourceExperience: boolean;
  interviewComfort: number;
  aptitudeComfort: number;
  
  // Section 4: Logistics & Preferences
  internshipTypePreference: string;
  preferredDuration: string;
  govtInternshipInterest: string;
  relocationReadiness: string;
  
  // Section 5: Career Intent
  primaryGoal: string;
  targetCompanies: string[];
  weeklyCommitmentHours: number;
  learningStyle: string;
  
  // Section 6: Social & Guidance
  wantsSeniorGuidance: boolean;
  wantsPeerComparison: boolean;
}

const initialData: OnboardingData = {
  yearOfStudy: '',
  cgpaRange: '',
  activeBacklogs: '',
  educationStream: '',
  universityName: '',
  degreeBranch: '',
  targetIndustries: [],
  coreEngineeringType: '',
  primaryTechnicalStrength: '',
  secondarySkills: [],
  certificationStatus: '',
  certificationFiles: [],
  projectExperienceLevel: '',
  hasPreviousInternships: false,
  internshipDetails: [],
  hasHackathonExperience: false,
  hasOpensourceExperience: false,
  interviewComfort: 3,
  aptitudeComfort: 3,
  internshipTypePreference: '',
  preferredDuration: '',
  govtInternshipInterest: '',
  relocationReadiness: '',
  primaryGoal: '',
  targetCompanies: [],
  weeklyCommitmentHours: 10,
  learningStyle: '',
  wantsSeniorGuidance: false,
  wantsPeerComparison: false,
};

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const totalSteps = 6;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    totalSteps,
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
  };
}
