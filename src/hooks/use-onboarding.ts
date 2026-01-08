import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';

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
  const [loading, setLoading] = useState(true);
  const totalSteps = 6;
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchOnboardingData = async () => {
      if (user) {
        try {
          const { data: onboardingData, error } = await supabase
            .from('onboarding_data')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found

          if (onboardingData) {
            // Map the database fields back to our OnboardingData interface
            const mappedData: Partial<OnboardingData> = {
              yearOfStudy: onboardingData.year_of_study,
              cgpaRange: onboardingData.cgpa_range,
              activeBacklogs: onboardingData.active_backlogs,
              educationStream: onboardingData.education_stream,
              universityName: onboardingData.university_name,
              degreeBranch: onboardingData.degree_branch,
              targetIndustries: onboardingData.target_industries || [],
              primaryTechnicalStrength: onboardingData.primary_technical_strength,
              secondarySkills: onboardingData.secondary_skills || [],
              certificationStatus: onboardingData.certification_status,
              projectExperienceLevel: onboardingData.project_experience_level,
              hasPreviousInternships: onboardingData.has_previous_internships,
              internshipDetails: (onboardingData.internship_details && Array.isArray(onboardingData.internship_details)) 
                ? onboardingData.internship_details as { company: string; role: string; duration: string }[] 
                : [],
              hasHackathonExperience: onboardingData.has_hackathon_experience,
              hasOpensourceExperience: onboardingData.has_opensource_experience,
              interviewComfort: onboardingData.interview_comfort,
              aptitudeComfort: onboardingData.aptitude_comfort,
              internshipTypePreference: onboardingData.internship_type_preference,
              preferredDuration: onboardingData.preferred_duration,
              govtInternshipInterest: onboardingData.govt_internship_interest,
              relocationReadiness: onboardingData.relocation_readiness,
              primaryGoal: onboardingData.primary_goal,
              targetCompanies: onboardingData.target_companies || [],
              weeklyCommitmentHours: onboardingData.weekly_commitment_hours,
              learningStyle: onboardingData.learning_style,
              wantsSeniorGuidance: onboardingData.wants_senior_guidance,
              wantsPeerComparison: onboardingData.wants_peer_comparison,
            };
            
            setData(prev => ({ ...prev, ...mappedData }));
          }
        } catch (error) {
          console.error('Error fetching onboarding data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOnboardingData();
  }, [user]);

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
    loading,
  };
}
